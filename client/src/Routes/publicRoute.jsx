import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { authContext } from '../contexts/authContext';

import Loader from '../components/loader';
import Footer from '../components/footer';
import Header from '../components/header';

import { useState} from 'react';

export default function PublicRoute() {
  const { user, authLoading } = useContext(authContext);
  const [isOpen, setIsOpen] = useState(false);


  if (authLoading) return <Loader />;
  if (user) return <Navigate to="/home" replace />;

  return (
    <div className='bg-black w-screen min-h-screen overflow-hidden relative'>
      <Header setIsOpen={setIsOpen} isOpen={isOpen} />
      <div className="pt-[70px] min-h-[calc(100vh-70px)]">
        <Outlet context={{ isOpen, setIsOpen }} />
      </div>
      <FooterOverlay />
    </div>
  );

  function FooterOverlay() {
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 50 }}>
        <Footer />
      </div>
    );
  }
}
