import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const [user] = useAuthState(auth);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Campus<span>Find</span></Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/browse">Browse Items</Link>
        <Link to="/report">Report Item</Link>
        <Link to="/about">About</Link>
      </div>

      <div className="auth-links">
        {user && (
          <>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
