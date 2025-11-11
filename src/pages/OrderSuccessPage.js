import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaClipboardList, FaShoppingBasket, FaTruck, FaCreditCard } from 'react-icons/fa';
import PublicLayout from '../comp/PublicLayout';
import "../style/Layout.css";

const OrderSuccessPage = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const orderId = location.state?.orderId || 'N/A';
  const paymentStatus = location.state?.paymentStatus || 'Processing';
  const finalTotal = location.state?.finalTotal || 0;
  const estimatedTime = '35 - 45 minutes';

  useEffect(() => {
    if (!orderId || !isLoggedIn) {
      navigate(isLoggedIn ? '/my-orders' : '/login');
    }
  }, [orderId, isLoggedIn, navigate]);

  const getPaymentDisplay = () => {
    const amount = typeof finalTotal === 'number' ? finalTotal.toFixed(2) : '0.00';
    if (paymentStatus === 'COD') return `Cash on Delivery (COD) - ₹${amount}`;
    if (paymentStatus === 'Paid') return `Paid Online - ₹${amount}`;
    return `Status: ${paymentStatus}`;
  };

  return (
    <PublicLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-success">
              <div className="card-body text-center p-5">
                
                <FaCheckCircle className="text-success mb-4" style={{ fontSize: '4rem' }} aria-label="Success" />
                
                <h1 className="card-title text-success mb-3">Order Placed Successfully!</h1>
                
                <p className="lead">
                  Your order has been confirmed and is now being prepared by the kitchen.
                </p>
                
                <h4 className="mb-4">
                  Order ID: <span className="fw-bold text-primary">#{orderId}</span>
                </h4>

                <div className="alert alert-light border-start border-success border-5 text-start p-3 mb-4">
                  <p className="mb-1">
                    <FaTruck className="me-2 text-info" /> 
                    <span className="fw-bold">Estimated Delivery:</span> {estimatedTime}
                  </p>
                  <p className="mb-0">
                    <FaCreditCard className="me-2 text-primary" /> 
                    <span className="fw-bold">Payment Status:</span> {getPaymentDisplay()}
                  </p>
                </div>

                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center mt-4">
                  <Link to="/my-orders" className="btn btn-primary btn-lg">
                    <FaClipboardList className='me-2' /> View My Orders
                  </Link>
                  <Link to="/menu" className="btn btn-outline-secondary btn-lg">
                    <FaShoppingBasket className='me-2' /> Continue Shopping
                  </Link>
                </div>

                <p className="mt-4 text-muted small">
                  You will receive an SMS confirmation shortly.
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default OrderSuccessPage;
