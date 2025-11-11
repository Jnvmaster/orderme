import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PublicLayout from '../comp/PublicLayout';
import { FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Cart = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart();

  const handleIncreaseQty = (id) => increaseQty(id);
  const handleDecreaseQty = (id) => decreaseQty(id);
  const handleRemoveItem = (id) => removeFromCart(id);

  const handleProceedToCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    } else {
      alert("Your cart is empty. Please add items before checking out.");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  return (
    <PublicLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
      <div className="container my-5">
        <h1 className="text-center mb-4">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="mt-3">Your cart is empty!</h3>
            <p className="text-muted">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/menu" className="btn btn-warning btn-lg mt-3">
              Browse Full Menu
            </Link>
          </div>
        ) : (
          <div className="row">
            {/* Cart Items */}
            <div className="col-lg-8">
              {cartItems.map((item) => (
                <div className="card shadow-sm mb-3" key={item.id}>
                  <div className="row g-0">
                    <div className="col-md-3">
                      <img
                        src={item.image || '/images/placeholder.png'} // Use backend image URL directly
                        alt={item.name}
                        className="img-fluid rounded-start"
                        style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/images/placeholder.png'; }} // fallback if broken
                      />
                    </div>
                    <div className="col-md-9">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <h5 className="card-title">{item.name}</h5>
                          <h5 className="text-warning fw-bold">₹{(item.price * item.qty).toFixed(2)}</h5>
                        </div>
                        <p className="card-text text-muted">Price per item: ₹{item.price.toFixed(2)}</p>

                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleDecreaseQty(item.id)}
                              disabled={item.qty <= 1}
                            >
                              -
                            </button>
                            <span className="mx-3 fw-bold">{item.qty}</span>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleIncreaseQty(item.id)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <FaTrash className="me-1" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="card-title text-center mb-3">Order Summary</h4>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Subtotal</span>
                      <strong>₹{subtotal.toFixed(2)}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Delivery Fee</span>
                      <strong>₹{deliveryFee.toFixed(2)}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between bg-light">
                      <h5 className="mb-0">Total</h5>
                      <h5 className="mb-0 text-warning fw-bold">₹{total.toFixed(2)}</h5>
                    </li>
                  </ul>
                  <button
                    className="btn btn-warning w-100 mt-3 btn-lg"
                    onClick={handleProceedToCheckout}
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Cart;
