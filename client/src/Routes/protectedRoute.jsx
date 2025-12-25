import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { authContext } from '../contexts/authContext';

import Loader from '../components/loader';
import Footer from '../components/footer';
import Header from '../components/header';

export default function ProtectedRoute() {
  const { user, authLoading } = useContext(authContext);

  if (authLoading) return <Loader />;
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className='bg-black w-screen overflow-hidden'>
      <Header />
      <div className="pt-[70px] min-h-[calc(100vh-70px)]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
