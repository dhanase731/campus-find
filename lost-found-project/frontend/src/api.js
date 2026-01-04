import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';

export const api = {
  // Create new item (Migrated to direct Firestore)
  async createItem(itemData) {
    try {
      if (!auth.currentUser) throw new Error('You must be logged in to report an item');

      const item = {
        title: itemData.title || 'Untitled Item',
        description: itemData.description || '',
        category: itemData.category || 'other',
        location: itemData.location || 'Unknown',
        status: itemData.status || 'lost',
        contactPhone: itemData.contactPhone || '',
        contactEmail: itemData.contactEmail || '',
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
        isActive: true
      };

      console.log('Attempting to save item to Firestore...');
      const docRef = await addDoc(collection(db, 'items'), item);
      console.log('✅ Item saved successfully! Doc ID:', docRef.id);
      return { id: docRef.id, ...item };
    } catch (error) {
      console.error('Firestore Create Error:', error);
      throw error;
    }
  },

  // Get all items with filters (Migrated to direct Firestore)
  async getItems(filters = {}) {
    try {
      console.log('Fetching items with filters:', filters);
      let q = collection(db, 'items');

      // Note: Composite queries (where + orderBy) require indexes in Firestore.
      // We start with a simple query and handle ordering/filtering carefully.
      let constraints = [where('isActive', '==', true)];

      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters.category) {
        constraints.push(where('category', '==', filters.category));
      }

      const firestoreQuery = query(q, ...constraints, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(firestoreQuery);

      let items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Search filter is better handled in-memory for basic implementations
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        items = items.filter(item =>
          (item.title || '').toLowerCase().includes(searchLower) ||
          (item.description || '').toLowerCase().includes(searchLower) ||
          (item.location || '').toLowerCase().includes(searchLower)
        );
      }

      return items;
    } catch (error) {
      console.error('Firestore Fetch Error:', error);
      // Fallback if index is not created yet
      if (error.code === 'failed-precondition') {
        console.warn('Index required. Check the console for the index creation link.');
      }
      throw error;
    }
  },

  // Get user's items
  async getUserItems() {
    if (!auth.currentUser) return [];
    const q = query(
      collection(db, 'items'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Update item status
  async updateItemStatus(itemId, isActive) {
    if (!auth.currentUser) throw new Error('Unauthenticated');
    const itemRef = doc(db, 'items', itemId);
    await updateDoc(itemRef, { isActive });
    return { success: true };
  },

  // Mark item as collected
  async markItemCollected(itemId, collectionData = null) {
    if (!auth.currentUser) throw new Error('Unauthenticated');
    const itemRef = doc(db, 'items', itemId);
    
    const updateData = {
      collectedBy: auth.currentUser.uid,
      collectedByEmail: auth.currentUser.email,
      collectedAt: serverTimestamp(),
      isActive: false
    };
    
    if (collectionData) {
      updateData.collectionDetails = collectionData;
    }
    
    await updateDoc(itemRef, updateData);
    return { success: true };
  }
};