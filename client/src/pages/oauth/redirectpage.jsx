/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react';
import Loader from '../../components/loader.jsx'
import {useState,useEffect,useContext} from 'react'
import api from '../../api/axios.js';

const RedirectPage = () => {
let [loading,setLoading] = useState(false);
let url = new URL(window.location.href);
let params = url.searchParams; 

let client_id = params.get('client_id');
let redirect_url = params.get('redirect_uri');
let response_type = params.get('response_type');
let scope = params.get('scope');

console.log('OAuth params:', { client_id, redirect_url, response_type, scope });

// ADD useEffect to auto-submit when component loads and user is logged in
useEffect(() => {
  const token = localStorage.getItem('OauthToken');
  if (token) {
    console.log('Auto-submitting because user is already logged in');
    submitHandler();
  }
}, []);

const submitHandler = () => {
  const token = localStorage.getItem('OauthToken');
  console.log('Token:', token);
  
  if (token) {
    console.log('token exists');
    api
      .get(`/user/userInfo`)
      .then(res => {
        setLoading(true);
        console.log('User data:', res.data);

        api
            .get(`/user/getCode?userId=${res.data._id}`)
            .then(r => {
              console.log('Full getCode response:', r.data);
              console.log('Authorization code:', r.data.code);
              
              const finalUrl = new URL(redirect_url);
              finalUrl.searchParams.set('code', r.data.code);
              
              // Add state if present
              const state = params.get('state');
              if (state) {
                finalUrl.searchParams.set('state', state);
              }
              
              console.log('Redirecting to:', finalUrl.toString());
              window.location.href = finalUrl.toString();
            })
            .catch(err => {
              console.log('Error getting code:', err);
              setLoading(false);
          });
      })
      .catch(err => {
        console.log('Error getting user info:', err);
        openNewTab();
      });
  } else {
    console.log('No token found');
    // Don't auto-open new tab here, let user click the button
  }
};

const openNewTab = () => {
  console.log('Opening OAuth login window');
  
  const loginUrl = `${import.meta.env.VITE_CLIENT_BASE_URL}/login?redirect=true&oauth=true&client_id=${client_id}`;
  const popup = window.open(loginUrl, '_blank', 'width=500,height=600');

  const checkPopup = setInterval(() => {
    if (popup.closed) {
      clearInterval(checkPopup);
      console.log('Popup closed, checking auth status...');
      
      const token = localStorage.getItem('OauthToken');
      if (token) {
        console.log('User logged in after popup closed');
        submitHandler(); // Retry with new token
      } else {
        console.log('User did not log in');
      }
    }
  }, 500);
};

  
  return (
    <div className={`body flex justify-center items-center h-screen w-screen bg-black`}>
      {loading && <Loader/>}
      {!loading && (
        <div className="mainContent text-black bg-black flex flex-col gap-7 w-[90%] max-w-[1200px] min-w-[400px] items-center justify-center">
          <div className="wrapper">
            <span 
              className="inline-block text-black bg-[#F7F4ED] text-[18px] md:text-[20px] rounded-xl py-2 px-4 cursor-pointer hover:bg-gray-100 transition-colors" 
              onClick={submitHandler}
            >
              Login With Jauth
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedirectPage;