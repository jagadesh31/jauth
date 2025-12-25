import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const authContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [authLoading, setAuthLoading] = useState(true);

  const logout = () => {
    setAuthLoading(true);
    api.get(`/user/logout`).then(() => {
      setUser(null);
      setAuthLoading(false);
      if (window.location.pathname !== '/') window.location.href='/';
    }).catch(() => {
      setAuthLoading(false);
    });
  };

  useEffect(() => {
    if (!user) {
      setAuthLoading(true);
      api
        .get(`/user/userInfo`)
        .then(res => {
          setUser(res.data);
          setAuthLoading(false);
          if (window.location.pathname === '/') window.location.href='/home';
        })
        .catch(() => {
          setAuthLoading(false);
          if (window.location.pathname !== '/') window.location.href='/';
        });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <authContext.Provider value={{ user, setUser, logout, authLoading }}>
      {children}
    </authContext.Provider>
  );
};