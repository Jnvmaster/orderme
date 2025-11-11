import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1a1a1a',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      
      {/* ✅ Logo */}
      <div className="logo" style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>
        <Link to="/" style={{ color: '#ffad08', textDecoration: 'none' }}>
          🍴 ORDERME
        </Link>
      </div>

      {/* ✅ Menu */}
      <div className="nav-links" style={{ display: 'flex', gap: '1.3rem', alignItems:"center" }}>
        {isLoggedIn && (
          <>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            <Link to="/menu" style={{ color: 'white', textDecoration: 'none' }}>Menu</Link>
            <Link to="/track" style={{ color: 'white', textDecoration: 'none' }}>Track</Link>
            <Link to="/orders" style={{ color: 'white', textDecoration: 'none' }}>My Orders</Link>
            
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
          </>
        )}
      </div>

      {/* ✅ Icons (wishlist + cart + profile) */}
      {isLoggedIn && (
        <div className="icon-wrapper" style={{ display:"flex", alignItems:"center", gap:"0", marginLeft:"10px" }}>

          <Link to="/wishlist" className="icon-btn">
            <FaHeart size={22} color="white" />
          </Link>

          <Link to="/cart" className="icon-btn">
            <FaShoppingCart size={22} color="white" />
          </Link>

          {/* ✅ User Menu */}
          <div style={{ marginLeft:"8px", cursor:"pointer", color:"white", display:"flex", alignItems:"center", gap:"5px" }}>
            <FaUser />
            <div className="dropdown">
              <span style={{ fontWeight: 500 }}>Profile ▼</span>
              <div className="dropdown-content">
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
