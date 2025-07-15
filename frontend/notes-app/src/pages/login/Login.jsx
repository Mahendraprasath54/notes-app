import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async(e)=>{
    e.preventDefault();

    if(!validateEmail(email))
    {
      setError("please enter a valid email");
      return;
    }

    if(!password)
    {
      setError("p;ease enter the password");
      return;
    }

    setError("")
    //login API call

    try{
      const response = await axiosInstance.post('/api/auth/login',{
        email : email,
        password:password
      })
      //sucessfuil login
      if(response.data && response.data.accessToken)
      {
        localStorage.setItem("token", response.data.accessToken)
        navigate('/dashboard')
      }

    }
    catch(error)
    {
      if(error.response && error.response.data && error.response.data.message)
      {
        setError(error.response.data);
      }
      else{
        setError("An unexpected error occured .please try again ")
      }
    }
  }
  return (
    <>
      <Navbar />

      <div className='flex items-center justify-center mt-10'>
        <div className='w-96 border rounded px-8 py-10'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl font-semibold mb-7 text-[#2B85FF]'>Login</h4>

            <input
              type="text"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder='Email'
              className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#2B85FF]'
            />
            <PasswordInput
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
             />

            {error && <p className='text-red-500 text-xs pb-1 pt-1'>{error}</p>}

            <button
              type='submit'
              className='w-full bg-[#2B85FF] text-white py-2 rounded font-medium hover:bg-[#1a63c8] transition-colors'
            >
              Login
            </button>

            <p className='text-sm text-center mt-6'>
              Not registered yet?{" "}
              <Link to='/signup' className='font-medium text-[#2B85FF] underline'>
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
