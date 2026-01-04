import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <div className="home-text">
        <h1>Reconnect with <br /><span>what's yours.</span></h1>
        <p>
          The most advanced campus lost and found system. <br />
          Helping you recover precious belongings through community trust.
        </p>

        <div className="home-buttons">
          <Link to="/report" className="btn btn-primary">Report an Item</Link>
          <Link to="/browse" className="btn btn-secondary">Browse Found Items</Link>
        </div>
      </div>
    </div>
  );
}
