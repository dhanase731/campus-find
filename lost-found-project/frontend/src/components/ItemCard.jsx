import { useState } from "react";
import { auth } from "../firebase";
import CollectionModal from "./CollectionModal";

export default function ItemCard({ id, title, location, status, description, contactPhone, contactEmail, collectedBy, collectedByEmail, onItemCollected }) {
  const [showContact, setShowContact] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  const hasContact = contactPhone || contactEmail;
  const currentUser = auth.currentUser;
  const isCollected = !!collectedBy;

  const handleMarkCollected = () => {
    if (!currentUser) {
      alert('Please log in to mark items as collected');
      return;
    }
    setShowCollectionModal(true);
  };

  const handleCollectionComplete = (itemId) => {
    setShowCollectionModal(false);
    if (onItemCollected) onItemCollected(itemId);
  };

  const itemData = { id, title, location, status, description, contactPhone, contactEmail };

  return (
    <>
      <div className={`item-card ${isCollected ? 'collected' : ''}`}>
        <span className={`status-badge ${status}`}>
          {status}
        </span>

        {isCollected && (
          <div className="collected-info">
            ✅ Collected by: {collectedByEmail}
          </div>
        )}

        <h3>{title}</h3>
        <div className="icon-label">📍 {location}</div>
        {description && <p className="description">{description}</p>}

        {hasContact && (
          <button
            className="contact-btn"
            onClick={() => setShowContact(!showContact)}
          >
            {showContact ? 'Hide Contact' : 'View Contact Information'}
          </button>
        )}

        {showContact && hasContact && (
          <div className="contact-details">
            {contactPhone && <div className="icon-label">📞 {contactPhone}</div>}
            {contactEmail && <div className="icon-label">✉️ {contactEmail}</div>}
          </div>
        )}

        {!isCollected && currentUser && (
          <button
            className="collect-btn"
            onClick={handleMarkCollected}
          >
            Mark as Collected
          </button>
        )}
      </div>

      {showCollectionModal && (
        <CollectionModal
          item={itemData}
          onClose={() => setShowCollectionModal(false)}
          onCollected={handleCollectionComplete}
        />
      )}
    </>
  );
}
