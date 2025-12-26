import 'react-toastify/dist/ReactToastify.css';
import { authContext } from '../../contexts/authContext';
import { useContext } from 'react';


const Base = () => {
  let {jauthLogin} = useContext(authContext);

  return (
    <>
      <div className={`body min-h-screen bg-[#F7F4ED] flex justify-center items-center overflow-hidden`}>
        <div className="mainContent text-black flex flex-col justify-center gap-8 w-[90%] max-w-[1200px] items-center text-center px-4">
          <div className="heading-section max-w-4xl">
            <h1 className="heading text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Secure OAuth 2.0 Implementation Made Simple
            </h1>
            <div className="subheading text-xl md:text-2xl lg:text-3xl text-gray-700 leading-relaxed mb-8">
              Build secure authentication flows with our developer-friendly OAuth 2.0 provider
            </div>
          </div>

          <div className="wrapper">
            <button 
              className="startReading inline-flex items-center gap-2 text-[#F7F4ED] bg-black text-lg md:text-xl rounded-xl py-3 px-8 cursor-pointer hover:bg-gray-800 transition-colors duration-200 shadow-lg"
              onClick={jauthLogin}
            >
              <span>Get Started</span>
              <span>→</span>
            </button>
            <p className="text-gray-600 mt-4 text-sm md:text-base">
              Get your API credentials and start integrating in minutes
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Base;  