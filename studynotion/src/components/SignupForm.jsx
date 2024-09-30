import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

const SignupForm = ({ setIsLoggedIn }) => {
    const [formdata, setformdata] = useState({firstname: '', lastname: '', email: '', password: '',confirmpassword: ''})
    const [showPassword, setshowPassword] = useState(false)
    const navigate = useNavigate();
    function changehandler(e){
        setformdata((prev)=>({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    function submitHandler(e) {
        e.preventDefault();
        if(formdata.password !== formdata.confirmpassword){
            toast.error('Password and Confirm Password should be same');
            return;
        }
        
        // Check login logic here if necessary
        setIsLoggedIn(true); // Correct prop name
        toast.success('Sign Up Successfully');
        const accountData={
            ...formdata,
        }
        console.log(accountData);
        navigate("/dashboard");    
    }
  return (
    <div>
        <div>
            <button>
                Student
            </button>
            <button>
                Instructor
            </button>
        </div>
        <form onSubmit={submitHandler}>
            {/*First Name or Last Name*/}
            <div>
            <label>
                <p>First Name<sup>*</sup></p>
                <input type="text" required name="firstname" onChange={changehandler} placeholder='Enter First Name' value={formdata.firstname} />
            </label>
            <label>
                <p>Last Name<sup>*</sup></p>
                <input type="text" required name="lastname" onChange={changehandler} placeholder='Enter First Name' value={formdata.lastname} />
            </label>
            </div>
              {/*Email*/}
            <label>
                <p>Email Address<sup>*</sup></p>
                <input type="email" required name="email" onChange={changehandler} placeholder='Enter email id' value={formdata.email} />   
            </label>

            {/*Password or Confirm Password**/}
            <div>
            <label>
                <p>Create Password<sup>*</sup></p>
                <input type={showPassword?("text"):("password")} required name="password" onChange={changehandler} placeholder='Enter Password' value={formdata.password} />
                <span onClick={()=>setshowPassword((prev)=>!prev)}>
            {showPassword?(<AiOutlineEyeInvisible/>):(<AiOutlineEyeInvisible/>)}
        </span>
            </label>
            
            <label>
                <p>Confirm Password<sup>*</sup></p>
                <input type={showPassword?("text"):("password")} required name="confirmpassword" onChange={changehandler} placeholder='Enter Password' value={formdata.confirmpassword} />
                <span onClick={()=>setshowPassword((prev)=>!prev)}>
            {showPassword?(<AiOutlineEyeInvisible/>):(<AiOutlineEyeInvisible/>)}
        </span>
            </label>
            </div>
            <button>
                Create Account
            </button>

            
        </form>
    </div>
  )
}

export default SignupForm