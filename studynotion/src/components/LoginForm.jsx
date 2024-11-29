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
        <form onSubmit={submitHandler} className='flex flex-col w-full gap-y-4 mt-6'>
            <label className='w-full'> {/* Fixed spelling from lable to label */}
                <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                    Email Address<sup className='text-pink-200'>*</sup>
                </p>
                <input 
                    type="email" 
                    name="email" 
                    required 
                    value={formData.email} 
                    onChange={changeHandler} 
                    placeholder='Enter email id' 
                    className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]'
                />
            </label>
           
            <label  className='w-full relative'> {/* Fixed spelling from lable to label */}
                <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                    Password<sup className='text-pink-200'>*</sup>
                </p>
                <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    required 
                    value={formData.password} 
                    onChange={changeHandler} 
                    placeholder='Enter Password' 
                    className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]'
                />
                <span className='absolute right-3 top-[38px] cursor-pointer' onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/> : <AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' />}
                </span>
                <Link to="#">
                    <p className='text-xs mt-1 text-blue-100 max-w-max ml-auto'>
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
