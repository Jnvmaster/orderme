import React, { useEffect, useState } from 'react';
import PublicLayout from '../comp/PublicLayout';
import "../style/home.css";
import { Link, useNavigate } from 'react-router-dom';

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/foods/random/') // updated endpoint
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                setFoods(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching foods:", err);
                setLoading(false);
            });
    }, []);

    const handleMenuClick = () => {
        navigate('/menu');
    };

    return (
        <PublicLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
           
            {/* Hero Banner */}
            <section
                className='hero-banner py-5 text-center' 
                style={{
                    backgroundImage: "url('/images/bgfood.png')",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                <div style={{
                    backgroundColor: 'rgba(0,0,0,0.5)', padding: '40px 20px',
                    borderRadius: '10px'
                }}>
                    <h1 className='display-4 text-white'>Get it hot. Get it fast. Get it now.</h1>
                    <p className='lead text-white'>Hungry? Your favorite food is just a tap away.</p>
                    
                    <form method='GET' action='/search' className='d-flex justify-content-center' style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <input type='text' name='q' placeholder='I would like to eat...' className='form-control'
                            style={{ borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px' }} />
                        <button className='btn btn-warning px-4'
                            style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
                        >Search</button>
                    </form>
                </div>
            </section>

            {/* Random Foods Section */}
            <section className='py-5'>
                <div className='container'>
                    <h2 className='text-center mb-4'>Most Loved Dishes Of this Week
                        <span className='badge bg-danger ms-2'>Top Picks</span>
                    </h2>

                    <div className='row mt-4'>
                        {loading ? (
                            <p className='text-center text-secondary'>Loading...</p>
                        ) : foods.length === 0 ? (
                            <p className='text-center'>No Foods Found</p>
                        ) : (
                            foods.map((food, index) => (
                                <div className='col-md-4 mb-4' key={food.id || index}>
                                    <div className='card hovereffect'>
                                        <img
                                            src={food.image_url || "https://via.placeholder.com/300x180"} 
                                            className='card-img-top'
                                            style={{ height: '180px', objectFit: 'cover' }}
                                            alt={food.name || 'Food Image'}
                                        />
                                        <div className='card-body'>
                                            <h5 className='card-title'>
                                                <Link to={`/food/${food.id}`}>{food.name}</Link> 
                                            </h5>
                                            <p>{food.description?.slice(0, 40) || 'No description'}...</p>

                                            <div className='d-flex justify-content-between align-items-center'>
                                                <span className='fw-bold'>₹{food.price || 'N/A'}</span>
                                                <Link 
                                                    to={`/food/${food.id}`} 
                                                    className='btn btn-outline-primary btn-sm'
                                                >
                                                    <i className='fas fa-shopping-basket me-1'> </i> Order Now
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* 3 Simple Steps Section */}
            <section className="simple-steps-section bg-dark text-white py-5">
                <div className="container text-center">
                    <h2>Ordering in 3 Simple Steps</h2>
                    <div className="row mt-4 pt-3">
                        <div className="col-md-4">
                            <h3 className="step-heading">1. Pick a dish you love</h3>
                            <p className="step-text">Explore hundreds of mouth-watering options and choose what you crave!</p>
                        </div>
                        <div className="col-md-4">
                            <h3 className="step-heading">2. Share your location</h3>
                            <p className="step-text">Tell us where you are, and we'll handle the rest.</p>
                        </div>
                        <div className="col-md-4">
                            <h3 className="step-heading">3. Enjoy doorstep delivery</h3>
                            <p className="step-text">Relax while your meal arrives fast and fresh — pay when it's delivered!</p>
                        </div>
                    </div>
                    <p className="mt-4 fs-5">Pay easily with Cash on Delivery — hassle-free!</p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-4">
                <div className="container text-center">
                    <h3 className="cta-heading">Ready to Satisfy Your Hunger?</h3>
                    <button onClick={handleMenuClick} className="btn btn-dark btn-lg cta-button">
                        Browse Full Menu
                    </button>
                </div>
            </section>

        </PublicLayout>
    )
}

export default Home;
