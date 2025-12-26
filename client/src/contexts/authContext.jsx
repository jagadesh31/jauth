import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const authContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [authLoading, setAuthLoading] = useState(false);

  const logout = () => {
    setAuthLoading(true);
    api.get(`/user/logout`).then(() => {
      setUser(null);
      setAuthLoading(false);
      // if (window.location.pathname !== '/') window.location.href='/';
    }).catch(() => {
      setAuthLoading(false);
    });
  };

  const jauthLogin = () => {
    const CLIENT_ID = import.meta.env.VITE_JAUTH_CLIENT_ID;
    const REDIRECT_URI = `${import.meta.env.VITE_SERVER_BASE_URL}/user/jauth/callback`;
    const SCOPE = "profile email";
    
    window.location.href = `${import.meta.env.VITE_JAUTH_BASE_URL}/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}`;
};

  const autoFetch = () => {
    if (!user) {
      setAuthLoading(true);
      api
        .get(`/user/userInfo`)
        .then(res => {
          setUser(res.data);
          setAuthLoading(false);
          // if (window.location.pathname === '/') window.location.href='/home';
        })
        .catch(() => {
          setAuthLoading(false);
          // if (window.location.pathname !== '/') window.location.href='/';
        });
    }
  }

  return (
    <authContext.Provider value={{ user, setUser, logout, authLoading,jauthLogin ,autoFetch}}>
      {children}
    </authContext.Provider>
  );
};