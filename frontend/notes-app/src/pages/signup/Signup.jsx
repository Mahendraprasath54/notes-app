import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput';
import Navbar from '../../components/Navbar/Navbar';
import axiosInstance from '../../utils/axiosInstance';
const Signup = () => {
  const[name,setName] = useState("");
  const[email,setEmail] = useState("");
  const[password,setPassword] = useState("");
  const[error,setError] = useState(null);
  
  const navigate = useNavigate();

  const handleSignUp = async (e) =>{
    e.preventDefault();

    if(!name)
    {
      setError("please enter your name");
      return;
    }

    if(!email)
    {
      setError("please enter a valid email address");
      return;
    }
    
    if(!password)
    {
      setError("please enter a valid password");
      return;
    }

    //signup API call
    
    try{
      const response = await axiosInstance.post('/api/auth/create-account',{
        fullName : name,
        email : email,
        password:password
      })
      //sucessfuil registration
      if(response.data && response.data.error)
      {
        setError(response.data.message);
        return;
      }
      if(response.data && response.data.accesstoken)
      {
        localStorage.setItem("token", response.data.accesstoken)
        navigate('/dashboard')
      }

    }
    catch(error)
    {
      if(error.response && error.response.data && error.response.data.message)
      {
        setError(error.response.data.message);
      }
      else{
        setError("An unexpected error occured .please try again ")
      }
    }

  };

  return(
  <>
      <Navbar />

      <div className='flex items-center justify-center mt-10'>
        <div className='w-96 border rounded px-8 py-10'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl font-semibold mb-7 text-[#2B85FF]'>SignUp</h4>
            <input
              type="text"
              placeholder='Name'
              value={name}
              className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#2B85FF]'
              onChange={(e)=>setName(e.target.value)}
            />
            <input
              type="text"
              placeholder='Email'
              value={email}
              className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#2B85FF]'
              onChange={(e)=>setEmail(e.target.value)}
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
                Create an account
              </button>
  
              <p className='text-sm text-center mt-6'>
                Already hve an account?{" "}
                <Link to='/login' className='font-medium text-[#2B85FF] underline'>
                  Login
                </Link>
              </p>
          </form>
        </div>
      </div>
  </>
  )
}

export default Signup
