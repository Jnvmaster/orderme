import React, { useState, useEffect } from 'react';
import PublicLayout from '../comp/PublicLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

const Fooddetails = ({ isLoggedIn, setIsLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/foods/${id}/`);

        if (!response.ok) {
          throw new Error('Food not found');
        }

        const data = await response.json();
        setFood(data);
      } catch (error) {
        console.error(error);
        toast.error("Could not load food details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!food) return;

    const cartItem = {
      id: food.id,
      name: food.name,
      description: food.description,
      price: parseFloat(food.price),
      image: food.image_url || '/images/placeholder.png', // use image_url from serializer
    };

    addToCart(cartItem);
    navigate('/cart');
  };

  return (
    <PublicLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
      <div className="container my-5">
        
        {loading && (
          <div className="text-center py-5">
            <h2>Loading Food Details...</h2>
          </div>
        )}

        {!loading && !food && (
          <div className="text-center py-5">
            <h2>Sorry, Food Not Found</h2>
            <p>The item you're looking for doesn't exist.</p>
          </div>
        )}

        {!loading && food && (
          <div className="row">
            <div className="col-md-6">
              <img 
                src={food.image_url || '/images/placeholder.png'} 
                alt={food.name}
                className="img-fluid rounded shadow-lg"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </div>
            <div className="col-md-6 d-flex flex-column justify-content-center">
              <h1>{food.name}</h1>
              <p className="lead">{food.description}</p>
              <h2 className="my-3 text-warning fw-bold">₹{food.price}</h2>
              <button 
                className='btn btn-warning btn-lg' 
                style={{ maxWidth: '250px' }}
                onClick={handleAddToCart}
              >
                <i className='fas fa-shopping-basket me-2'></i> Add to Cart
              </button>
            </div>
          </div>
        )}

      </div>
    </PublicLayout>
  );
}

export default Fooddetails;
