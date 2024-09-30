import React from 'react'
import Template from '../components/Template'
import SignupImg from '../assets/signup.png'    
const Signup = ({setIsLoggedIn}) => {
  return (
    <Template
    title="kjoin bhai shab"
    desc1="kuch bhi"
     desc2="Sign up"
     image={SignupImg}
     formtype="signup"
     setIsLoggedIn={setIsLoggedIn}
    />
  )
}

export default Signup