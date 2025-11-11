import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaBox } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../comp/PublicLayout'; 
import "../style/Layout.css"; 

// --- MOCK CART CONTEXT (Use your actual context/store in production) ---
const useCart = () => {
  const mockCartItems = [
    { id: 16, name: 'chiken lollipop', price: 140.00, qty: 1 }, 
  ];
  const subtotal = mockCartItems.reduce((total, item) => total + (item.price * item.qty), 0);
  const deliveryFee = 50.00;
  const finalTotal = subtotal + deliveryFee;

  return { 
    cartItems: mockCartItems, 
    subtotal, 
    deliveryFee, 
    finalTotal 
  };
};
// ----------------------------------------------------------------------

const CheckoutPage = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  // --- AUTH PROTECT ---
  useEffect(() => {
    if (!isLoggedIn) {
      alert("You must be logged in to proceed to checkout.");
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const { cartItems, subtotal, deliveryFee, finalTotal } = useCart(); 

  const [deliveryAddress] = useState({ 
    name: 'Rahul Sharma',
    phone: '9876543210',
    address: 'A-201, OrderMe Apartments, Mumbai',
    pincode: '400001',
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mockPaymentSuccess, setMockPaymentSuccess] = useState(false);

  // --- MOCK ONLINE PAYMENT ---
  const handleMockPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setMockPaymentSuccess(true);
      setIsProcessing(false);
      handlePlaceOrder();
    }, 1000);
  };

  // --- PLACE ORDER FUNCTION ---
  const handlePlaceOrder = async () => {
    if (isProcessing) return;

    // If ONLINE, process mock first
    if (selectedPaymentMethod === 'online' && !mockPaymentSuccess) {
      handleMockPayment();
      return;
    }

    setIsProcessing(true);

    if (!deliveryAddress.address || !deliveryAddress.name) {
      alert("Please complete your delivery address.");
      setIsProcessing(false);
      return;
    }

    // ✅ DO NOT SEND TOTAL — backend will verify price
    const orderData = {
      cart_items: cartItems.map(item => ({
        id: parseInt(item.id),
        qty: parseInt(item.qty)
      })),
      delivery_address: deliveryAddress,
      payment_method: selectedPaymentMethod
    };

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8000/api/orders/place', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(orderData),
      });

      // Token invalid
      if ([401,403].includes(response.status)) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        alert("Session expired. Please login again.");
        navigate('/login');
        setIsProcessing(false);
        return;
      }

      const result = await response.json();

      if (response.ok && result.success) {
        const paymentType = selectedPaymentMethod === 'cod' ? 'COD' : 'Paid';

        alert(`Order placed successfully! (${paymentType})`);

        navigate('/order-success', { 
          state: { 
            orderId: result.order_id, 
            paymentStatus: paymentType,
            finalTotal: result.final_amount   // ✅ Use backend calculated total
          } 
        });
      } else {
        alert(`Order placement failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Cannot connect to server. Start Django backend.");
    }

    setIsProcessing(false);
    setMockPaymentSuccess(false);
  };

  // --- PAYMENT UI ---
  const renderPaymentOptions = () => (
    <div className="card-body">
      <h5 className="card-title mb-3">Select Payment Method</h5>

      <div className="form-check mb-3 p-3 border rounded">
        <input 
          className="form-check-input" 
          type="radio" 
          name="paymentMethod" 
          id="codRadio" 
          value="cod"
          checked={selectedPaymentMethod === 'cod'}
          onChange={() => { setSelectedPaymentMethod('cod'); setMockPaymentSuccess(false); }}
        />
        <label className="form-check-label fw-bold d-block" htmlFor="codRadio">
          <FaMoneyBillWave className="me-2 text-success" /> Cash on Delivery (COD)
        </label>
        <small className="text-muted ms-4">Pay when you receive your order.</small>
      </div>

      <div className="form-check p-3 border rounded">
        <input 
          className="form-check-input" 
          type="radio" 
          name="paymentMethod" 
          id="onlineRadio" 
          value="online"
          checked={selectedPaymentMethod === 'online'}
          onChange={() => { setSelectedPaymentMethod('online'); setMockPaymentSuccess(false); }}
        />
        <label className="form-check-label fw-bold d-block" htmlFor="onlineRadio">
          <FaCreditCard className="me-2 text-primary" /> Pay Online (Mock)
        </label>
        <small className="text-muted ms-4">Simulates payment success for testing.</small>
        
        {selectedPaymentMethod === 'online' && (
          <div className="alert alert-info mt-3 py-2">
            {mockPaymentSuccess 
              ? <p className='mb-0 fw-bold text-success'>Payment Mock Succeeded! Click "Place Order".</p>
              : <p className='mb-0'>Click "Place Order" to simulate payment.</p>
            }
          </div>
        )}
      </div>
    </div>
  );

  return (
    <PublicLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
      <div className="container py-5">
        <h2 className="mb-4 text-center">Checkout</h2>
        <div className="row">

          <div className="col-lg-8">

            <div className="card shadow-sm mb-4">
              <div className="card-header bg-dark text-white fw-bold d-flex align-items-center">
                <FaMapMarkerAlt className="me-2" /> Delivery Address
              </div>
              <div className="card-body">
                <p className="fw-bold mb-1">{deliveryAddress.name} ({deliveryAddress.phone})</p>
                <p className="mb-1">{deliveryAddress.address}</p>
                <p className="text-muted">{deliveryAddress.pincode}</p>
                <button className="btn btn-sm btn-outline-secondary mt-2">Change Address</button>
              </div>
            </div>
            
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-dark text-white fw-bold d-flex align-items-center">
                <FaCreditCard className="me-2" /> Payment
              </div>
              {renderPaymentOptions()}
            </div>

          </div>

          <div className="col-lg-4">
            <div className="card shadow-lg sticky-top" style={{ top: '20px' }}>
              <div className="card-header bg-warning text-dark fw-bold d-flex align-items-center">
                <FaBox className="me-2" /> Order Summary
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span className="fw-bold">₹{subtotal.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Delivery Fee</span>
                    <span className="fw-bold text-success">₹{deliveryFee.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between bg-light fw-bold">
                    <h4>Total Payable</h4>
                    <h4>₹{finalTotal.toFixed(2)}</h4>
                  </li>
                </ul>

                <button 
                  className="btn btn-warning w-100 mt-4 py-2 fw-bold" 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    `Place Order & ${selectedPaymentMethod === 'cod' ? 'Pay on Delivery' : 'Confirm Order'}`
                  )}
                </button>

                <p className="text-center mt-2 text-muted small">
                  By placing the order, you agree to the terms and conditions.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
};

export default CheckoutPage;
