import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { CartProvider } from './context/CartContext';

// Import Pages
import Home from './pages/home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddCategory from './pages/AddCategory';
import ManageCategory from './pages/ManageCategory';
import AddFood from './pages/AddFood';
import ManageFood from './pages/ManageFood';
import Searchpages from './pages/Searchpages';
import Fooddetails from './pages/Fooddetails';
import Cart from './pages/Cart';
import CheckoutPage from './pages/CheckoutPage'; // NEW IMPORT
import OrderSuccessPage from './pages/OrderSuccessPage'; // NEW IMPORT
import MyOrdersPage from './pages/MyOrdersPage'; // NEW IMPORT

// Import Components
import Register from './comp/Register';
import Login from './comp/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') ? true : false);

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* --- Public Routes --- */}
          <Route
            path="/login"
            element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/register"
            element={<Register isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/"
            element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/search"
            element={<Searchpages isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/food/:id"
            element={<Fooddetails isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/cart"
            element={<Cart isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />
          
          {/* --- ORDER FLOW ROUTES (FIX) --- */}
          <Route
            path="/checkout"
            element={<CheckoutPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/order-success"
            element={<OrderSuccessPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/my-orders"
            element={<MyOrdersPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* --- Admin Routes --- */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/manage-category" element={<ManageCategory />} />
          <Route path="/add-food" element={<AddFood />} />
          <Route path="/manage-food" element={<ManageFood />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
