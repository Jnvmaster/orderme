import React, { useState } from 'react'
import PublicLayout from './PublicLayout'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

const Register = ({ isLoggedIn, setIsLoggedIn }) => {

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        mobile_number: "",
        password: '',
        repeat_password: ""
    })
    
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState("");
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        const { firstname, lastname, email, mobile_number, password, repeat_password } = formData

        if (password !== repeat_password) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstname, lastname, email, mobile_number, password })
            });

            const result = await response.json();

            if (response.status === 201) {
                toast.success(result.message);
                setShowOtpInput(true);
            }
            else {
                toast.error(result.message);
            }
        }
        catch (error) {
            console.error(error)
            toast.error("An error occurred during registration.");
        }
    };
    
    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/verify-otp/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    otp: otp
                })
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message);
                navigate('/login');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Verification failed. Please try again.");
            console.error(error);
        }
    };

    return (
        <PublicLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
            <ToastContainer position='top-right' autoClose={2000} />
            <div className='container py-5'>
                <div className='row shadow-lg rounded-4 justify-content-center'>
                    
                    {!showOtpInput ? (
                        <>
                            <div className='col-md-6 p-4'>
                                <h3 className='text-center mb-4'>
                                    <i className='fas fa-user-plus me-2'></i>User Registration
                                </h3>

                                <form onSubmit={handleRegisterSubmit}>
                                    <div className='mb-3'>
                                        <input name="firstname" type="text" className="form-control" value={formData.firstname} onChange={handleChange} placeholder='Enter your first name' required />
                                    </div>
                                    <div className='mb-3'>
                                        <input name="lastname" type="text" className="form-control" value={formData.lastname} onChange={handleChange} placeholder='Enter your last name' required />
                                    </div>
                                    <div className='mb-3'>
                                        <input name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} placeholder='Enter your email id' required />
                                    </div>
                                    <div className='mb-3'>
                                        <input name="mobile_number" type="tel" className="form-control" value={formData.mobile_number} onChange={handleChange} placeholder='Enter your mobile number' required />
                                    </div>
                                    <div className='mb-3'>
                                        <input name="password" type="password" className="form-control" value={formData.password} onChange={handleChange} placeholder='Enter your password' required />
                                    </div>
                                    <div className='mb-3'>
                                        <input name="repeat_password" type="password" className="form-control" value={formData.repeat_password} onChange={handleChange} placeholder='Repeat your password' required />
                                    </div>
                                    <button type="submit" className='btn btn-primary w-100'>
                                        <i className='fas fa-user-check me-2'></i>Register
                                    </button>
                                </form>
                            </div>

                            <div className='col-md-6 d-flex align-items-center justify-content-center'>
                                <div>
                                    <img src='/images/register.png' className='img-fluid' style={{ maxHeight: '400px' }} alt="Register"/>
                                    <h5>Registration is fast, secure, and safe.</h5>
                                    <p>Join with us to enjoy the tour of FoodLand</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='col-md-6 p-4'>
                            <h3 className='text-center mb-4'>
                                <i className='fas fa-key me-2'></i> Verify Your Account
                            </h3>
                            <p className='text-center text-muted'>
                                An OTP has been sent to {formData.email}.
                            </p>
                            <form onSubmit={handleVerifySubmit}>
                                <div className='mb-3'>
                                    <input
                                        name="otp"
                                        type="text"
                                        className="form-control"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder='Enter the 6-digit OTP'
                                        required
                                    />
                                </div>
                                <button type="submit" className='btn btn-success w-100'>
                                    <i className='fas fa-check me-2'></i>Verify OTP
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    )
}

export default Register;
