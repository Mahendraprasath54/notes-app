import React, { useState } from 'react'

import {FaRegEye, FaRegEyeSlash} from "react-icons/fa"
const PasswordInput = ({value, onChange, placeholder}) => {

    const[isShowPassword,setIsShowPassword] = useState(false);

    const toggleShowPassword = ()=> {
        setIsShowPassword(!isShowPassword);
    }
  return (
    <div className='flex items-center border border-gray-400 rounded focus-within:ring-2 focus-within:ring-[#2B85FF] mb-3 w-full'>
  <input 
    value={value}
    onChange={onChange}
    type={isShowPassword ? "text" : "password"}
    placeholder={placeholder || 'password'}
    className='w-full outline-none bg-transparent px-2 py-2'
  />
  {isShowPassword ? 
  (<FaRegEye
  size={30}
  className='text-primary cursor-pointer pr-1.5' 
  onClick={()=>{toggleShowPassword()}}
  />) :( <FaRegEyeSlash 
        size={30}
        className='text-slate-400 cursor-pointer'
        onClick={()=>{toggleShowPassword()}}
      />)}

      
  
</div>

  )
}

export default PasswordInput
