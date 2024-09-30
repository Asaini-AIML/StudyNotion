import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    function changeHandler(e) {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    function submitHandler(e) {
        e.preventDefault();
        
        // Check login logic here if necessary
        setIsLoggedIn(true); // Correct prop name
        toast.success('Logged In Successfully');
        navigate("/dashboard");    
    }

    return (
        <form onSubmit={submitHandler}>
            <label> {/* Fixed spelling from lable to label */}
                <p>
                    Email Address<sup>*</sup>
                </p>
                <input 
                    type="email" 
                    name="email" 
                    required 
                    value={formData.email} 
                    onChange={changeHandler} 
                    placeholder='Enter email id' 
                />
            </label>
           
            <label> {/* Fixed spelling from lable to label */}
                <p>
                    Password<sup>*</sup>
                </p>
                <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    required 
                    value={formData.password} 
                    onChange={changeHandler} 
                    placeholder='Enter Password' 
                />
                <span onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEyeInvisible />}
                </span>
                <Link to="#">
                    <p>
                        Forgot Password
                    </p>
                </Link>
            </label>
            <button type="submit"> {/* Added type="submit" */}
                Sign In
            </button>
        </form>
    );
}

export default LoginForm;
