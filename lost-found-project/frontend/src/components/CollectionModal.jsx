import { useState } from 'react';
import { api } from '../api';

export default function CollectionModal({ item, onClose, onCollected }) {
  const [formData, setFormData] = useState({
    collectorName: '',
    rollNumber: '',
    phone: '',
    email: '',
    idCardPhoto: null,
    collectorPhoto: null,
    itemPhoto: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const generateReceipt = () => {
    const receiptContent = `
LOST & FOUND COLLECTION RECEIPT
================================

Item Details:
- Title: ${item.title}
- Description: ${item.description}
- Location Found: ${item.location}
- Category: ${item.category}
- Reported By: ${item.userEmail}

Collector Details:
- Name: ${formData.collectorName}
- Roll Number: ${formData.rollNumber}
- Phone: ${formData.phone}
- Email: ${formData.email}

Collection Date: ${new Date().toLocaleString()}

This receipt confirms the collection of the above item.
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${item.title.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.collectorName || !formData.rollNumber || !formData.phone || !formData.email) {
      alert('Please fill all required fields');
      return;
    }

    if (!formData.idCardPhoto || !formData.collectorPhoto || !formData.itemPhoto) {
      alert('Please upload all required photos');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert files to base64 for storage
      const collectionData = {
        collectorName: formData.collectorName,
        rollNumber: formData.rollNumber,
        phone: formData.phone,
        email: formData.email,
        hasPhotos: true // Just track that photos were uploaded
      };

      await api.markItemCollected(item.id, collectionData);
      generateReceipt();
      onCollected(item.id);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to complete collection: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Collection Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="collection-form">
          <div className="form-section">
            <h3>Collector Information</h3>
            <div className="form-row">
              <input
                name="collectorName"
                placeholder="Full Name *"
                value={formData.collectorName}
                onChange={handleInputChange}
                required
              />
              <input
                name="rollNumber"
                placeholder="Roll Number *"
                value={formData.rollNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Required Photos</h3>
            <div className="photo-uploads">
              <div className="upload-item">
                <label>ID Card Photo *</label>
                <input
                  type="file"
                  name="idCardPhoto"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="upload-item">
                <label>Collector Photo *</label>
                <input
                  type="file"
                  name="collectorPhoto"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="upload-item">
                <label>Item Photo *</label>
                <input
                  type="file"
                  name="itemPhoto"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? 'Processing...' : 'Complete Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}