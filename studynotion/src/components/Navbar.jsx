import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo.svg';
import toast from 'react-hot-toast';

const Navbar = (props) => {
   let isLoggedIn = props.isLoggedIn;
   let setIsLoggedIn = props.setIsLoggedIn;
        
  return (
    <div className="flex items-center">
      <Link to="/">
        <img src={logo} alt='logo' width={160} height={32} loading='lazy' />
      </Link>
      <nav>
        <ul className="flex space-x-3"> {/* Use space-x-3 for horizontal spacing */}
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/">About</Link>
          </li>
          <li>
            <Link to="/">Contact</Link>
          </li>
        </ul>
      </nav>
      <div className='flex ml-3 mr-3 gap-3'>
        { !isLoggedIn &&
          <Link to="/login">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Log In
            </button>
            </Link>
        }   
        {
          !isLoggedIn &&
          <Link to="/signup">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign Up
            </button>
          </Link>
        }
        {
          isLoggedIn &&
          <Link to="/logout">
            <button onClick={()=>{
              setIsLoggedIn(false);
              toast.success('Logged Out Successfully');
            }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Log Out
            </button>
          </Link>
        }
        {  
          isLoggedIn &&
          <Link to="/dashboard">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Dashboard
            </button>
          </Link>
        }

      </div>
    </div>
  );
};

export default Navbar;
