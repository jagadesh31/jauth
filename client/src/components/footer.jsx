import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className='footer bg-black text-[#F7F4ED] h-[60px] flex justify-center items-center w-screen'>
      <div className="container w-[90%] max-w-[1200px] min-w-[400px] flex items-center justify-between">
        <div className='left self-start text-[16px] md:text-[18px] list-none gap-3 flex items-center'>
          <li className='cursor-pointer hover:text-gray-300 transition-colors duration-200' onClick={() => navigate('/about')}>About</li>
          <li className='cursor-pointer hover:text-gray-300 transition-colors duration-200' onClick={() => navigate('/docs')}>Docs</li>
          <li className='cursor-pointer hover:text-gray-300 transition-colors duration-200' onClick={() => window.open('https://github.com/jagadesh31/jauth', '_blank')}>Help</li>
        </div>
      </div>
    </div>
  );
};

export default Footer;