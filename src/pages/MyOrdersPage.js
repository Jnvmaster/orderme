import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaSpinner, FaClock, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';
import PublicLayout from '../comp/PublicLayout';
import "../style/Layout.css";

const MyOrdersPage = ({ isLoggedIn, setIsLoggedIn }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication required.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/orders/history/', { // Trailing slash added
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data);
        setError(null);

      } catch (e) {
        console.error("Fetch error:", e);
        setError("Could not load order history. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'Delivered':
        return <span className="badge bg-success"><FaCheckCircle className="me-1" /> {status}</span>;
      case 'Preparing':
      case 'Out_for_Delivery':
        return <span className="badge bg-primary">{status.replace('_', ' ')}</span>;
      case 'COD_Pending':
      case 'Awaiting_Payment':
        return <span className="badge bg-warning text-dark">{status.replace('_', ' ')}</span>;
      case 'Cancelled':
        return <span className="badge bg-danger">{status}</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    return new Date(dateTimeString).toLocaleString();
  };

  if (isLoading) {
    return (
      <PublicLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <div className="container py-5 text-center">
          <FaSpinner className="fa-spin fa-2x text-warning" />
          <p className="mt-2">Loading your orders...</p>
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <div className="container py-5 text-center text-danger">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
      <div className="container my-5">
        <h1 className="text-center mb-5"><FaBox className="me-2 text-warning" /> My Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-5 border rounded bg-light">
            <h3>No Orders Found</h3>
            <p className="text-muted">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="row g-4">
            {orders.map((order) => (
              <div className="col-12" key={order.id}>
                <div className="card shadow-sm border">
                  <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Order ID: #{order.id}</h5>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <p className="mb-0"><FaClock className="me-2 text-muted" /> <span className="fw-bold">Date Placed:</span> {formatDateTime(order.order_date)}</p>
                      <h4 className="mb-0 text-warning fw-bold">Total: ₹{parseFloat(order.total_amount).toFixed(2)}</h4>
                    </div>

                    <p className="text-muted small"><span className="fw-bold">Delivering to:</span> {order.delivery_address_full || 'N/A'}</p>
                    <p className="mb-3"><FaMoneyBillWave className="me-2 text-info" /> <span className="fw-bold">Payment:</span> {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>

                    <h6 className="mt-3 border-bottom pb-1">Items Ordered:</h6>
                    {order.items && order.items.length > 0 ? (
                      <ul className="list-group list-group-flush">
                        {order.items.map((item, index) => (
                          <li className="list-group-item d-flex justify-content-between" key={index}>
                            <span>{item.quantity} x {item.item_name}</span>
                            <span className="text-muted">₹{(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No items found for this order.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default MyOrdersPage;
