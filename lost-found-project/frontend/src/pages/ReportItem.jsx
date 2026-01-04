import { useState } from "react";
import { api } from "../api";

export default function ReportItem() {
  const [selectedType, setSelectedType] = useState('lost');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electronics',
    location: '',
    contactPhone: '',
    contactEmail: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate that at least one contact method is provided
    if (!formData.contactPhone && !formData.contactEmail) {
      alert('Please provide at least one contact method (phone or email)');
      setLoading(false);
      return;
    }

    try {
      await api.createItem({
        ...formData,
        status: selectedType
      });
      alert(`${selectedType === 'lost' ? 'Lost' : 'Found'} item "${formData.title}" reported successfully!`);
      setFormData({ title: '', description: '', category: 'electronics', location: '', contactPhone: '', contactEmail: '' });
    } catch (error) {
      console.error('Error details:', error);
      alert('Error reporting item: ' + (error.message || 'Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="report-content">
        <header className="browse-header">
          <h1>Report an Item</h1>
          <p className="subtitle">Help the community by sharing details about a lost or found item</p>
        </header>

        <div className="report-options">
          <div
            className={`option-card ${selectedType === 'lost' ? 'active' : ''}`}
            onClick={() => setSelectedType('lost')}
          >
            <h3>I Lost Something</h3>
            <p>We'll notify you when a match is found</p>
          </div>

          <div
            className={`option-card ${selectedType === 'found' ? 'active' : ''}`}
            onClick={() => setSelectedType('found')}
          >
            <h3>I Found Something</h3>
            <p>Help bring an item back to its owner</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label>Item Name</label>
            <input
              placeholder="e.g. Blue Hydro Flask, Silver AirPods..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="electronics">Electronics</option>
              <option value="books">Books</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Provide specific details like stickers, scratches, or unique features..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Location Last Seen / Found</label>
            <input
              placeholder="e.g. Library 2nd Floor, Canteen Area 4..."
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting Report...' : `Report ${selectedType === 'lost' ? 'Lost' : 'Found'} Item`}
          </button>
        </form>
      </div>
    </div>
  );
}