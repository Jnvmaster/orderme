import { useEffect, useState } from 'react';
import PublicLayout from '../comp/PublicLayout';
import { Link, useLocation } from 'react-router-dom';
import "../style/home.css";

const Searchpages = ({ isLoggedIn, setIsLoggedIn }) => {
    const query = new URLSearchParams(useLocation().search).get('q') || '';
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query) {
            setLoading(true);
            fetch(`http://127.0.0.1:8000/api/foods/search/?q=${query}`)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    setFoods(Array.isArray(data) ? data : []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching foods:", err);
                    setFoods([]);
                    setLoading(false);
                });
        } else {
            setFoods([]);
        }
    }, [query]);

    return (
        <PublicLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
            <div className='container py-4'>
                <h3 className='text-center text-primary'>
                    Results For: '{query}'
                </h3>

                <div className='row mt-4'>
                    {loading ? (
                        <p className='text-center text-secondary'>Loading...</p>
                    ) : foods.length === 0 ? (
                        <p className='text-center text-muted'>No Foods Found</p>
                    ) : (
                        foods.map((food) => (
                            <div className='col-md-4 mb-4' key={food.id}>
                                <div className='card hovereffect shadow-sm'>
                                    <img
                                        src={
                                            food.image
                                                ? food.image.startsWith('http')
                                                    ? food.image
                                                    : `http://127.0.0.1:8000${food.image}`
                                                : "https://via.placeholder.com/300x180"
                                        }
                                        className='card-img-top'
                                        style={{ height: '180px', objectFit: 'cover' }}
                                        alt={food.name || 'Food Image'}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/300x180";
                                        }}
                                    />
                                    <div className='card-body'>
                                        <h5 className='card-title'>
                                            <Link to={`/food/${food.id}`} className='text-decoration-none text-dark'>
                                                {food.name}
                                            </Link>
                                        </h5>
                                        <p className='text-muted'>
                                            {food.description
                                                ? `${food.description.slice(0, 60)}...`
                                                : 'No description available'}
                                        </p>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <span className='fw-bold text-success'>
                                                ₹{food.price || 'N/A'}
                                            </span>
                                            <Link
                                                to={`/food/${food.id}`}
                                                className='btn btn-outline-primary btn-sm'
                                            >
                                                <i className='fas fa-shopping-basket me-1'></i>
                                                Order Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PublicLayout>
    );
};

export default Searchpages;
