import React, { useState, useEffect } from 'react'
import { 
  FaHome, FaSignInAlt, FaUserPlus, FaUserShield, FaUtensils, FaSignOutAlt,
  FaShoppingCart, FaHeart, FaBox, FaUserCircle 
} from 'react-icons/fa'
import { FaTruck } from 'react-icons/fa6'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'; 
import "../style/Layout.css"; 

const PublicLayout = ({ children, isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("User");
  
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((total, item) => total + item.qty, 0); 

  useEffect(() => {
    if (isLoggedIn) {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;

      if (user) {
        setIsAdmin(user.is_staff);
        setUserName(user.first_name || user.email || "User"); 
      } else {
        setIsAdmin(false);
        setUserName("User");
      }
    } else {
      setIsAdmin(false);
      setUserName("User");
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="layout-wrapper">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg py-2">
        <div className="container d-flex align-items-center">

          <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center" to="/">
            <FaUtensils className="me-2 fs-4" />
            ORDERME
          </Link>

          <button className="navbar-toggler" type="button" 
            data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            {isLoggedIn && (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/"><FaHome className='me-2'/>Home</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/menu"><FaUtensils className='me-2'/>Menu</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/track"><FaTruck className='me-2'/>Track</Link>
                </li>

                {!isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/my-orders"><FaBox className='me-2'/>My Orders</Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/"><FaHeart className='me-2'/>wishlist</Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/cart">
                        <FaShoppingCart className='me-2'/>Cart
                        {cartItemCount > 0 && (
                          <span className="badge rounded-pill bg-danger ms-1">
                            {cartItemCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  </>
                )}

                {isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin-login"><FaUserShield className='me-2'/>Admin</Link>
                  </li>
                )}
              </ul>
            )}
          </div>

          
          <div className="d-flex align-items-center">
            {isLoggedIn ? (
              <>
                <div className="dropdown">
                  <button className="btn btn-dark dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                    <FaUserCircle className="me-2" /> {userName}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/my-profile">My Profile</Link></li>
                    <li><Link className="dropdown-item" to="/change-password">Change Password</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <FaSignOutAlt className='me-2'/>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              location.pathname !== '/admin-login' && (
                <>
                  <Link className="nav-link text-white me-3" to="/register">
                    <FaUserPlus className='me-2'/>Register
                  </Link>

                  <Link className="nav-link text-white" to="/login">
                    <FaSignInAlt className='me-2'/>Login
                  </Link>
                </>
              )
            )}
          </div>
          
        </div>
      </nav>

      <div>{children}</div>

      <footer className='text-center py-3 mt-5'>
        <p>&copy; 2025 ORDERME. All rights reserved</p>
      </footer>
    </div>
  );
};

export default PublicLayout;