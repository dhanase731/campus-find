import { useState, useEffect } from "react";
import ItemCard from "../components/ItemCard";
import { api } from "../api";

// Sample data for demo
const sampleItems = [
  { id: 1, title: "Blue Water Bottle", location: "Library", status: "lost", description: "Blue plastic water bottle with stickers" },
  { id: 2, title: "AirPods Case", location: "Canteen", status: "found", description: "White AirPods case, slightly used" },
  { id: 3, title: "Notebook", location: "Classroom 101", status: "lost", description: "Red spiral notebook with math notes" },
  { id: 4, title: "Black Jacket", location: "Gym", status: "found", description: "Black hoodie, size M" }
];

export default function Browse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await api.getItems();
      setItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = !filters.search ||
      item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.location.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = !filters.status || item.status === filters.status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">
      <header className="browse-header">
        <h1>Browse Items</h1>
        <p className="subtitle">Explore items lost or found by the campus community</p>
      </header>

      <div className="browse-filters">
        <input
          className="filter-input"
          placeholder="Search items by name or location..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
          <option value="other">Other</option>
        </select>
        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Initializing database...</div>
      ) : (
        <div className="items-grid">
          {filteredItems.map(item => (
            <ItemCard
              key={item.id}
              id={item.id}
              title={item.title}
              location={item.location}
              status={item.status}
              description={item.description}
              contactPhone={item.contactPhone}
              contactEmail={item.contactEmail}
              collectedBy={item.collectedBy}
              collectedByEmail={item.collectedByEmail}
              onItemCollected={loadItems}
            />
          ))}
          {filteredItems.length === 0 && (
            <div className="empty-state">
              <h3>No items found</h3>
              <p>Try adjusting your search or filters to see more results.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
