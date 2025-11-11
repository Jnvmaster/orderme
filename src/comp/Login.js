import React, { useState } from 'react';
import PublicLayout from './PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';


const Login = ({ isLoggedIn, setIsLoggedIn }) => {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);

        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        setIsLoggedIn(true);
        navigate('/');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login.");
    }
  };

  return (
    <PublicLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
      <ToastContainer position='top-right' autoClose={2000} />

      <div className='container py-5'>
        <div className='row shadow-lg rounded-4 justify-content-center'>
          
          <div className='col-md-6 p-4'>
            <h3 className='text-center mb-4'>
              <i className='fas fa-sign-in-alt me-2'></i> User Login
            </h3>

            <form onSubmit={handleLoginSubmit}>
              <div className='mb-3'>
                <label htmlFor="loginInput" className="form-label">Email or Phone Number</label>
                <input
                  name="email"
                  type="text"
                  className="form-control"
                  id="loginInput"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Enter your email or phone number'
                  required
                />
              </div>

              <div className='mb-3'>
                <label htmlFor="passInput" className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  id="passInput"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Enter your password'
                  required
                />
              </div>

              <button type="submit" className='btn btn-primary w-100'>
                <i className='fas fa-sign-in-alt me-2'></i>Login
              </button>
            </form>

            <p className='text-center mt-3'>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>

          <div className='col-md-6 d-flex align-items-center justify-content-center'>
            <div className='text-center'>
              <img
                src='/images/login.jpg'
                alt="Login"
                style={{
                  width: '100%',
                  height: '350px',
                  objectFit: 'cover',
                  borderRadius: '10px'
                }}
              />
              <h5 className='mt-3'>Welcome Back!</h5>
              <p>Login to access your account and order history.</p>
            </div>
          </div>

        </div>
      </div>

    </PublicLayout>
  );
};

export default Login;
