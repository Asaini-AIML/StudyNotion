import React from 'react'
import Template from '../components/Template'
import loginImg from '../assets/login.png'
const Login = ({setIsLoggedIn}) => {
  return (
   <Template
   
   title="Welcome back"
   desc1="New here? what you wana do?"
    desc2="Sign in krna chahate ho?"
    image={loginImg}
    formtype="login"
    setIsLoggedIn={setIsLoggedIn}
   />
  )
}

export default Login