import { useContext } from 'react';
import { IoNotificationsOutline } from "react-icons/io5";
import { authContext } from './../contexts/authContext';

const Header = () => {
  const { logout } = useContext(authContext);

  return (
    <div className='header bg-black text-[#F7F4ED] h-[70px] flex items-center justify-center w-full border-[#F7F4ED] border-b-2 shadow-sm fixed top-0 left-0 z-40'>
      <div className="container w-[90%] max-w-[1200px] flex justify-between items-center">
        <div className="left text-[24px] md:text-[26px] cursor-pointer font-extrabold">OAuth</div>
        <div className="right text-[#F7F4ED] text-[16px] md:text-[18px] cursor-pointer flex items-center gap-4 md:gap-6">
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
            <IoNotificationsOutline className='text-[#F7F4ED] text-[20px] md:text-[24px]' />
          </button>
          <div className="flex items-center gap-3">
            <div className='rounded-full w-8 h-8 bg-gray-300 flex items-center justify-center'>
              <span className="text-black text-sm font-medium">U</span>
            </div>
            <button 
              className="text-black bg-[#F7F4ED] text-[16px] md:text-[18px] rounded-xl py-2 px-4 cursor-pointer hover:bg-gray-200 transition-colors duration-200"
              onClick={() => { logout() }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;