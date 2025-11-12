/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react';
import axios from 'axios'
import Loader from '../components/loader.jsx'
import {useState,useEffect,useContext} from 'react'
import {redirect, useNavigate} from 'react-router-dom'
import { authContext } from '../contexts/authContext.jsx';
import { TbBrandOauth } from "react-icons/tb";

const RedirectPage = () => {
let [loading,setLoading] = useState(false);
let url = new URL(window.location.href);
let params = url.searchParams; 

let purpose = params.get('client_id');
let token = params.get('code');
let response_type = params.get('response_type');
let redirect_url = params.get('redirect_uri');
let scope = params.get('scope');

const submitHandler = () => {
  const token = localStorage.getItem('OauthToken');
  console.log(token)
  if (token) {
    console.log('token exists');
    axios
      .get(`${import.meta.env.VITE_SERVER_BASE_URL}/user/getInfo`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setLoading(true);
        console.log(res.data[0]);
              axios
            .get(`${import.meta.env.VITE_SERVER_BASE_URL}/user/getCode?userId=${res.data[0]._id}`, {
             })
            .then(r => {
             const finalUrl = new URL(redirect_url);
finalUrl.searchParams.set('code', r.data);
window.location.href = finalUrl.toString();

                 setTimeout(()=>{window.location.href=`${redirect_url}?code=${r.data}`},1000)
            })
            .catch(err => {
          console.log(err);
      });
      })
      .catch(err => {
        console.log(err);
            openNewTab();
      });
  } else {
    openNewTab();
  }
};

const openNewTab = () => {
  console.log('Opening OAuth login window');

  const popup = window.open(`${import.meta.env.VITE_CLIENT_BASE_URL}?redirect=true`, '_blank', 'width=500,height=600');

  window.addEventListener('message', (event) => {
    if (event.origin !== import.meta.env.VITE_CLIENT_BASE_URL) return;

    if (event.data === 'oauth-complete') {
      console.log('OAuth finished!');

      const token = localStorage.getItem('OauthToken');
      if (!token) return;

        axios
      .get(`${import.meta.env.VITE_SERVER_BASE_URL}/user/getInfo`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setLoading(true);
        console.log(res.data[0]);
              axios
            .get(`${import.meta.env.VITE_SERVER_BASE_URL}/user/getCode?userId=${res.data[0]._id}`, {
             })
            .then(r => {
              console.log(r.data)
              console.log(`${redirect_url}?code=${r.data}`)
                 setTimeout(()=>{window.location.href=`${redirect_url}?code=${r.data}`},1000)
            })
            .catch(err => {
          console.log(err);
      });
      })
      .catch(err => {
        console.log(err);
            openNewTab();
      });
    }
  });
};

  
  return (
    <div className={`body flex justify-center items-center h-screen w-screen bg-black `}>
      {loading && <Loader/>}
      {!loading &&<div className="mainContent text-black bg-black flex flex-col gap-7 w-[90%] max-w-[1200px] min-w-[400px] items-center justify-center">
        <div className="wrapper">
        <span className="inline-block text-black bg-[#F7F4ED] text-[18px] md:text-[20px] rounded-xl py-2 px-4 cursor-pointer" onClick={submitHandler}>Login With Oauth</span>
        </div>
        {/* <div className="heading text-[70px] md:[80px] font-bold">Welcome to Medium.</div>
        <div className="subheading text-[24px] md:text-[26px]">A place to read, write, and deepen your understanding</div>
          <li className='flex flex-col gap-3 w-1/2'>
            <label htmlFor="email" className='text-[18px] md:text-[20px] font-medium'>Your Username</label>
            <input type="email" name="email" id="email" placeholder='Enter your Username' value={username}  className='bg-[#f2f2f2] px-3 py-2 focus:border-gray-800 border-1 border-gray-500 focus:border-1 focus:outline-none rounded-md' onChange={(e)=>setUsername(e.target.value)}/>
          </li>
          <li className='flex flex-col gap-3 w-1/2'>
            <label htmlFor="email" className='text-[18px] md:text-[20px] font-medium'>create Password</label>
            <input type="password" name="password" id="password" placeholder='create your password' value={password}  className='bg-[#f2f2f2] px-3 py-2 focus:border-gray-800 border-1 border-gray-500 focus:border-1 focus:outline-none rounded-md' onChange={(e)=>setPassword(e.target.value)}/>
          </li> */}
      </div>}
    </div>
  );
};

export default RedirectPage;