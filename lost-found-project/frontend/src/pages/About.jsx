export default function About() {
  return (
    <div className="page-container">
      <div className="about-content">
        <header className="about-header">
          <h1>About Lost & Found</h1>
          <p className="subtitle">Your campus community platform for reuniting lost items with their owners</p>
        </header>

        <div className="process-section">
          <h2>How It Works</h2>
          
          <div className="process-steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Report an Item</h3>
              <p>Found something? Lost something? Create a report with details like title, description, location, and contact information. Choose whether it's a "Lost" or "Found" item.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Browse & Search</h3>
              <p>Browse through reported items using filters for category, status, or search by keywords. Contact the reporter if you find a match.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Collection Process</h3>
              <p>When collecting an item, provide verification details:</p>
              <ul>
                <li>Full name and roll number</li>
                <li>Phone number and email</li>
                <li>ID card photo for verification</li>
                <li>Your photo for identification</li>
                <li>Photo of the item being collected</li>
              </ul>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Receipt & Documentation</h3>
              <p>After successful collection, a receipt is automatically generated and downloaded with all collection details for record-keeping.</p>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2>Project Team</h2>
          <p>This Lost & Found system was built by:</p>
          
          <div className="admin-grid">
            <div className="admin-card">
              <h3>ELAKKIYA</h3>
              <p>📞 6381047342</p>
            </div>
            <div className="admin-card">
              <h3>DHANASEELAN</h3>
              <p>📞 9790831205</p>
            </div>
            <div className="admin-card">
              <h3>THRISHNA</h3>
              <p>📞 9629096489</p>
            </div>
            <div className="admin-card">
              <h3>DIVYADHARSHINY</h3>
              <p>📞 6369702149</p>
            </div>
          </div>
          
          <p className="contact-note">For technical support or system issues, contact any of the team members above.</p>
        </div>

        <div className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h4>🔐 Secure Authentication</h4>
              <p>Login required for reporting and collecting items</p>
            </div>
            <div className="feature-item">
              <h4>📱 Real-time Updates</h4>
              <p>Instant updates when items are reported or collected</p>
            </div>
            <div className="feature-item">
              <h4>🔍 Smart Search</h4>
              <p>Filter by category, status, or search by keywords</p>
            </div>
            <div className="feature-item">
              <h4>📄 Digital Receipts</h4>
              <p>Automatic receipt generation for all collections</p>
            </div>
            <div className="feature-item">
              <h4>📸 Photo Verification</h4>
              <p>Photo requirements ensure secure item collection</p>
            </div>
            <div className="feature-item">
              <h4>📞 Contact Integration</h4>
              <p>Easy communication between finders and owners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}