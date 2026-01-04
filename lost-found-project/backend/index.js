const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Create/Report Item
exports.createItem = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { title, description, category, location, status, imageUrl } = data;

  const item = {
    title: title || 'Untitled Item',
    description: description || '',
    category: category || 'other',
    location: location || 'Unknown',
    status: status || 'lost', // 'lost' or 'found'
    imageUrl: imageUrl || null,
    contactPhone: data.contactPhone || '',
    contactEmail: data.contactEmail || '',
    userId: context.auth.uid,
    userEmail: context.auth.token.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    isActive: true
  };

  const docRef = await db.collection('items').add(item);
  return { id: docRef.id, ...item };
});

// Get Items
exports.getItems = functions.https.onCall(async (data, context) => {
  const { status, category, search } = data;

  let query = db.collection('items').where('isActive', '==', true);

  if (status) {
    query = query.where('status', '==', status);
  }

  if (category) {
    query = query.where('category', '==', category);
  }

  // Get snapshot - simplified query to avoid index issues in dev
  const snapshot = await query.get();

  const items = [];
  snapshot.forEach(doc => {
    const item = { id: doc.id, ...doc.data() };

    // Safety check for fields before filtering
    const title = (item.title || '').toLowerCase();
    const description = (item.description || '').toLowerCase();
    const location = (item.location || '').toLowerCase();

    // Simple search filter
    if (search) {
      const searchLower = search.toLowerCase();
      if (title.includes(searchLower) ||
        description.includes(searchLower) ||
        location.includes(searchLower)) {
        items.push(item);
      }
    } else {
      items.push(item);
    }
  });

  // Sort by createdAt desc in-memory to avoid index requirement for simple dev use
  return items.sort((a, b) => {
    const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
    const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
    return dateB - dateA;
  });
});

// Get User Items
exports.getUserItems = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const snapshot = await db.collection('items')
    .where('userId', '==', context.auth.uid)
    .orderBy('createdAt', 'desc')
    .get();

  const items = [];
  snapshot.forEach(doc => {
    items.push({ id: doc.id, ...doc.data() });
  });

  return items;
});

// Update Item Status
exports.updateItemStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { itemId, isActive } = data;

  const itemRef = db.collection('items').doc(itemId);
  const item = await itemRef.get();

  if (!item.exists) {
    throw new functions.https.HttpsError('not-found', 'Item not found');
  }

  if (item.data().userId !== context.auth.uid) {
    throw new functions.https.HttpsError('permission-denied', 'Not authorized');
  }

  await itemRef.update({ isActive });
  return { success: true };
});

// Mark Item as Collected
exports.markItemCollected = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { itemId, collectionData } = data;

  const itemRef = db.collection('items').doc(itemId);
  const item = await itemRef.get();

  if (!item.exists) {
    throw new functions.https.HttpsError('not-found', 'Item not found');
  }

  const itemData = item.data();
  if (itemData.collectedBy) {
    throw new functions.https.HttpsError('already-exists', 'Item already collected');
  }

  const updateData = {
    collectedBy: context.auth.uid,
    collectedByEmail: context.auth.token.email,
    collectedAt: admin.firestore.FieldValue.serverTimestamp(),
    isActive: false
  };

  if (collectionData) {
    updateData.collectionDetails = collectionData;
  }

  await itemRef.update(updateData);
  return { success: true };
});