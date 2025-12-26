// pages/oauth/RedirectPage.jsx
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

  // Extract OAuth params from URL
  const params = useMemo(() => {
    const url = new URL(window.location.href);
    return {
      redirectUri: url.searchParams.get('redirect_uri'),
      state: url.searchParams.get('state'),
      clientId: url.searchParams.get('client_id'),
    };
  }, []);

  // Validate redirect URI
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

  // Redirect with authorization code
  const redirectWithCode = useCallback(
    (code) => {
      try {
        const finalUrl = new URL(params.redirectUri);
        finalUrl.searchParams.set('code', code);
        if (params.state) {
          finalUrl.searchParams.set('state', params.state);
        }
        // Replace to avoid back button issues
        window.location.replace(finalUrl.toString());
      } catch (error) {
        console.error('Redirect error:', error);
        toast.error('Failed to redirect. Please try again.');
        setLoading(false);
      }
    },
    [params.redirectUri, params.state]
  );

  // Generate authorization code after user login
  const authorize = useCallback(
    async (userData) => {
      if (!userData || !userData._id) {
        // No user logged in - show auth popup
        setShowAuthUI(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await api.get(`/oauth/getCode`);

        if (!data.code) {
          throw new Error('No authorization code received');
        }

        // Redirect with code
        redirectWithCode(data.code);
      } catch (error) {
        console.error('Authorization error:', error);
        toast.error(error.response?.data?.message || 'Authorization failed');
        setLoading(false);
      }
    },
    [redirectWithCode]
  );

  // Check user session on mount
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

        // User exists, get authorization code
        await authorize(res.data);
      } catch (error) {
        console.error('Session check error:', error);
        // User not logged in - show auth UI
        setShowAuthUI(true);
        setLoading(false);
      }
    };

    checkSession();
  }, [isValidRedirectUri, authorize]);

  // Handle successful auth
  const onAuthSuccess = async () => {
    setShowAuthUI(false);
    setLoading(true);

    try {
      const res = await api.get('/user/userInfo');
      setUser(res.data);

      // Get authorization code and redirect
      await authorize(res.data);
    } catch (error) {
      console.error('Auth success check error:', error);
      toast.error('Failed to complete authorization');
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Loading state - full screen loader */}
      {loading && <Loader />}

      {/* Auth modal - overlays loader */}
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
