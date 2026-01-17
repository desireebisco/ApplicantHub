import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./navbar.css";
import Login from "../Login/login";

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav className="navbar">
      {/* Logo + Site Name */}
      <div className="navbar-left">
        <img src="/logo/e.jpg" alt="Forza Logo" className="navbar-logo" />
        <h1 className="navbar-title">Forza Global Services</h1>
      </div>

      {/* Navigation Links + Login/User */}
      <div className="nav-items">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>

        {/* Login / Logout */}
        {user ? (
          <div className="user-info">
            <span>Welcome, {user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => setShowLogin(true)}>
            Login
          </button>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onLogin={(loggedUser) => setUser(loggedUser)}
        />
      )}
    </nav>
  );
}
