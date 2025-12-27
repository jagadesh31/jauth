import { useEffect, useMemo, useState, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from '../../components/loader.jsx';
import AuthUI from './authUI.jsx';
import api from '../../api/axios.js';

const RedirectPage = () => {
  const [loading, setLoading] = useState(true);
  const [showAuthUI, setShowAuthUI] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [appInfo, setAppInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [consentLoading, setConsentLoading] = useState(false);

  const params = useMemo(() => {
    const url = new URL(window.location.href);
    return {
      redirectUri: url.searchParams.get('redirect_uri'),
      originUri: url.searchParams.get('origin_uri'),
      clientId: url.searchParams.get('client_id'),
      scope: url.searchParams.get('scope'),
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

  const fetchAppInfo = useCallback(async () => {
    try {
      const res = await api.get(`/user/getApp?clientId=${params.clientId}`);
      console.log('App Info:', res.data);
      setAppInfo(res.data);
    } catch (err) {
      console.error('Error fetching app info:', err);
      setAppInfo(null);
    }
  }, [params.clientId]);

    const fetchUserInfo = useCallback(async () => {
    try {
      const res = await api.get(`/user/jauthUserInfo`);
      console.log('User Info:', res.data);
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching app info:', err);
      setAppInfo(null);
    }
  }, [params.clientId]);

  const requestAuthorizationCode = useCallback(async () => {
    try {
      setConsentLoading(true);
      const res = await api.get('/oauth/getCode', {
        params: {
          client_id: params.clientId,
          redirect_uri: params.redirectUri,
          scope: params.scope,
        },
      });

      window.location.replace(`${params.redirectUri}?code=${res.data.code}`);
    } catch (error) {
      console.error('Authorization error:', error);
      toast.error(error.response?.data?.error || 'Authorization failed');
      setConsentLoading(false);
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

        await fetchAppInfo();
        setShowConsent(true);
        setLoading(false);
      } catch (err) {
        setShowAuthUI(true);
        setLoading(false);
      }
    };

    checkSession();
  }, [isValidRedirectUri, fetchAppInfo]);

  const onAuthSuccess = async () => {
    setShowAuthUI(false);
    await fetchUserInfo();
    await fetchAppInfo();
    setShowConsent(true);
  };

  const handleAccept = async () => {
    await requestAuthorizationCode();
  };

  const handleDeny = () => {
      window.location.replace(`${params.originUri}?error=access_denied`);
      return;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} />

      {loading && <Loader />}

      {showAuthUI && <AuthUI onSuccess={onAuthSuccess} loading={loading} />}

      {showConsent && (
        <ConsentScreen
          appInfo={appInfo}
          user={user}
          scope={params.scope}
          onAccept={handleAccept}
          onDeny={handleDeny}
          loading={consentLoading}
        />
      )}
    </>
  );
};

export default RedirectPage;

function ConsentScreen({ appInfo, user, scope, onAccept, onDeny, loading }) {
  const scopes = scope ? scope.split(' ').filter(Boolean) : [];

  const scopeDescriptions = {
    'all-credentials': 'Access all your credentials and applications',
    'read:credentials': 'Read your credentials',
    'write:credentials': 'Create and modify credentials',
    'delete:credentials': 'Delete credentials',
    'profile': 'Access your profile information',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            Permission Request
          </h2>
          <p className="text-sm sm:text-base text-black/70 mb-6">
            {appInfo?.appName || 'An application'} is requesting access to your account
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-black/5 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-black mb-3">
                This application will:
              </h3>
              <ul className="space-y-2">
                {scopes.length > 0 ? (
                  scopes.map((s) => (
                    <li
                      key={s}
                      className="text-xs sm:text-sm text-black/80 flex items-start gap-2"
                    >
                      <span className="text-black font-bold mt-0.5">•</span>
                      <span>{scopeDescriptions[s] || s}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs sm:text-sm text-black/80">
                    Access your account information
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-black/5 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-black mb-2">
                You are signed in as:
              </h3>
              <p className="text-xs sm:text-sm text-black/80">
                {user?.email || user?.username || 'User'}
              </p>
              {appInfo?.originUrls && appInfo.originUrls.length > 0 && (
                <div className="mt-3 pt-3 border-t border-black/10">
                  <p className="text-xs font-medium text-black/60 mb-2">
                    Application Origin:
                  </p>
                  <p className="text-xs text-black/80 break-all">
                    {appInfo.originUrls[0]}
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-black/60 mb-6 text-center">
            Only proceed if you trust this application
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onDeny}
              disabled={loading}
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg border border-black/20 text-sm sm:text-base font-semibold text-black bg-white hover:bg-black/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Deny
            </button>
            <button
              onClick={onAccept}
              disabled={loading}
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg bg-black text-white text-sm sm:text-base font-semibold hover:bg-black/90 transition-colors disabled:bg-black/60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authorizing...
                </>
              ) : (
                'Allow Access'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



