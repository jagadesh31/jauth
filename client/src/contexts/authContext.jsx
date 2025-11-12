import axios from 'axios'

import { createContext, useState,useEffect } from 'react';
import {useLocation} from 'react-router-dom';

export const authContext = createContext();

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [authLoading,setAuthLoading] = useState(true);

  const logout=()=>{
    setUser(null);
    localStorage.removeItem('OauthToken');
  }
  
    useEffect(()=>{
    if (!user) {
      console.log('entered')
      const token = localStorage.getItem('OauthToken');
      if (token) {
        console.log('token exists')
        axios
          .get(`${import.meta.env.VITE_SERVER_BASE_URL}/user/getInfo`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(res => {
          console.log(res);
          setUser(res.data[0]);
          setAuthLoading(false)
          }).catch(err=>{
            console.log(err)
            if(err.status==401){
              logout();
            }
            setAuthLoading(false)
          })
      } else{setAuthLoading(false)};
    }
  },[]);

  return (
    <authContext.Provider value={{user,setUser,logout,authLoading}}>
      {children}
    </authContext.Provider>
  )
}