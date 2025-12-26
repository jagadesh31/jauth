
import { useEffect, useMemo, useState, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from '../../components/loader.jsx';
import AuthUI from './authUI.jsx';
import api from '../../api/axios.js';

const RedirectPage = () => {
  const [loading, setLoading] = useState(true);
  const [showAuthUI, setShowAuthUI] = useState(false);
  const [user, setUser] = useState(null);


  const params = useMemo(() => {
    const url = new URL(window.location.href);
    return {
      redirectUri: url.searchParams.get('redirect_uri'),
      clientId: url.searchParams.get('client_id'),
      scope: url.searchParams.get('scope')
    };
  }, []);

  
  const isValidRedirectUri = useCallback(() => {
    if (!params.redirectUri) {
      toast.error('Invalid redirect URI');
      return false;
    }
    try {
      new URL(params.redirectUri);
      return true;
    } catch {
      toast.error('Invalid redirect URI format');
      return false;
    }
  }, [params.redirectUri]);


  const requestAuthorizationCode = useCallback(async () => {
    try {
      setLoading(true);

      let res = await api.get('/oauth/getCode', {
        params: {
          client_id: params.clientId,
          redirect_uri: params.redirectUri,
          scope: params.scope
        }
      });

    window.location.replace(`${params.redirectUri}?code=${res.data.code}`);

    } catch (error) {
      console.error('Authorization error:', error);
      toast.error(
        error.response?.data?.error || 'Authorization failed'
      );
      setLoading(false);
    }
  }, [params]);


 
  useEffect(() => {
    if (!isValidRedirectUri()) {
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        setLoading(true);
        const res = await api.get('/user/userInfo');
        setUser(res.data);


        await requestAuthorizationCode();
      } catch (err) {
        setShowAuthUI(true);
        setLoading(false);
      }
    };

    checkSession();
  }, [isValidRedirectUri, requestAuthorizationCode]);

  
  const onAuthSuccess = async () => {
    setShowAuthUI(false);
    await requestAuthorizationCode();
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} />

      {loading && <Loader />}

      {showAuthUI && (
        <AuthUI
          onSuccess={onAuthSuccess}
          loading={loading}
        />
      )}
    </>
  );
};

export default RedirectPage;
