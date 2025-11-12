import React from 'react';

const Footer = () => {
  return (
    <div className='footer bg-black text-[#F7F4ED] h-[60px] flex justify-center items-center w-screen'>
    <div className="container w-[90%] max-w-[1200px] min-w-[400px] flex items-center justify-between">
      <div className='left self-start text-[16px] md:text-[18px] list-none gap-3 flex items-center'>
        <li>About</li>
        <li>Help</li>
        <li>Terms</li>
        <li>privacy</li>
        </div>
      </div>
    </div>
  );
};

export default Footer;