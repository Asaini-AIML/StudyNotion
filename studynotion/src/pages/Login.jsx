import React from 'react'
import Template from '../components/Template'
import loginImg from '../assets/login.png'
const Login = ({setIsLoggedIn}) => {
  return (
   <Template
   title="Welcome back"
   desc1="New here?"
    desc2="Sign in"
    image={loginImg}
    formtype="login"
    setIsLoggedIn={setIsLoggedIn}
   />
  )
}

export default Login