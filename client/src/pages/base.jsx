import { useState, useEffect, useContext } from "react";
import { useNavigate, Navigate } from 'react-router-dom';
import axios from "axios";
import { FaGoogle } from "react-icons/fa";
import { SiDash } from "react-icons/si";
import { MdOutlineEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { authContext } from '../contexts/authContext';

let icons = {
  'google': <FaGoogle />,
  'dauth': <SiDash />,
  'github': <FaGithub />,
  'email': <MdOutlineEmail />,
};

const Base = () => {
  const { user, setUser, logout } = useContext(authContext);

  const params = new URLSearchParams(window.location.search);
  const token = params.get('OauthToken');
  const redirect = params.get('redirect');

  useEffect(() => {
    if (token) {
      localStorage.setItem('OauthToken', token);
      window.location.href = 'http://localhost:5173';
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [currentDialog, setCurrentDialog] = useState('DefaultDialog');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const sendLink = (purpose) => {
    axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/user/createLink?email=${email}&purpose=${purpose}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === 'Send Successfully') {
          toast.success(res.data.message);
          setCurrentDialog('LinkSent');
        } else {
          toast.warn(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.message || 'Something went wrong');
      });
  };

  let dialog = {
    'DefaultDialog': <DefaultDialog setCurrentDialog={setCurrentDialog} />,
    'Signin': <Signin setCurrentDialog={setCurrentDialog} />,
    'SignupWithEmail': <SignupWithEmail setCurrentDialog={setCurrentDialog} setEmail={setEmail} email={email} password={password} setPassword={setPassword} sendLink={sendLink} setUser={setUser} redirect={redirect} username={username} setUsername={setUsername} setIsOpen={setIsOpen} />,
    'LinkSent': <LinkSent email={email} />,
    'SigninWithEmail': <SigninWithEmail setCurrentDialog={setCurrentDialog} setEmail={setEmail} email={email} password={password} setPassword={setPassword} setUser={setUser} redirect={redirect} setIsOpen={setIsOpen} />,
  };

  if (user) {
    return <Navigate to='/home' replace />;
  }

  return (
    <>
      <ToastContainer />
      <Header setIsOpen={setIsOpen} isOpen={isOpen} />
      <div className={`body flex justify-center items-center w-screen min-h-screen bg-[#F7F4ED] py-20`}>
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
              onClick={() => setIsOpen(true)}
            >
              <span>Start Building</span>
              <span>→</span>
            </button>
            <p className="text-gray-600 mt-4 text-sm md:text-base">
              Get your API credentials and start integrating in minutes
            </p>
          </div>

          {isOpen &&
            <div className="fixed inset-0 z-50 rounded-lg shadow-xl w-screen h-screen bg-transparent backdrop-blur-xl bg-opacity-50 flex justify-center items-center p-4">
              <div className="container bg-white shadow-xl h-auto max-h-[90vh] w-full max-w-[500px] md:w-[450px] text-black flex flex-col rounded-2xl overflow-hidden">
                <div className="flex justify-end p-4">
                  <button 
                    onClick={() => { setCurrentDialog('DefaultDialog'); setIsOpen(false); setEmail(''); setPassword(''); setUsername(''); }} 
                    className='text-gray-500 hover:text-gray-700 text-xl font-bold p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {dialog[currentDialog]}
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <Footer isOpen={isOpen} />
    </>
  );
};

const Header = ({ setIsOpen }) => {
  return (
    <div className={`header bg-[#F7F4ED] text-black h-[70px] flex items-center justify-center w-screen border-black border-b-2 fixed top-0 left-0 shadow-sm z-40`}>
      <div className="container w-[90%] max-w-[1200px] flex justify-between items-center px-4">
        <div className="left text-2xl md:text-3xl cursor-pointer font-extrabold">JAuth</div>
        <div className="right text-black text-base md:text-lg list-none flex gap-6 items-center">
          <li className='cursor-pointer hover:text-gray-700 transition-colors duration-200'>Documentation</li>
          <li className='cursor-pointer hover:text-gray-300 transition-colors duration-200'>About</li>
          <button 
            className='text-[#F7F4ED] bg-black py-2 px-4 rounded-xl cursor-pointer hover:bg-gray-800 transition-colors duration-200'
            onClick={() => setIsOpen(true)}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className={`footer bg-black text-[#F7F4ED] py-4 flex justify-center items-center w-screen absolute bottom-0`}>
      <div className="container w-[90%] max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <div className='right self-start text-base md:text-lg list-none gap-6 flex flex-wrap justify-center'>
          <li className='cursor-pointer hover:text-gray-300 transition-colors duration-200'>About</li>
          <li className='cursor-pointer hover:text-gray-300 transition-colors duration-200'>Documentation</li>
          <li className='cursor-pointer hover:text-gray-300 transition-colors duration-200'>Support</li>
          <li className='cursor-pointer hover:text-gray-300 transition-colors duration-200'>Terms</li>
          <li className='cursor-pointer hover:text-gray-300 transition-colors duration-200'>Privacy</li>
        </div>
      </div>
    </div>
  );
};

function DefaultDialog({ setCurrentDialog }) {
  return (
    <div className="flex flex-col justify-center items-center p-6 gap-6 bg-transparent w-full ">
      <div className="content text-black flex flex-col gap-6 w-full">
        <div className="text-center">
          <h2 className='text-2xl md:text-3xl font-bold mb-2'>Welcome to JAuth</h2>
          <p className="text-gray-600">Create your developer account to get started</p>
        </div>
        
        <div className="space-y-4">
          <button 
            className='w-full border-2 border-gray-300 rounded-xl px-4 py-3 flex items-center justify-center gap-4 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200'
            onClick={() => { setCurrentDialog('SignupWithEmail') }}
          >
            <span className="logo text-xl">{icons.email}</span>
            <span className="title font-medium">Continue with Email</span>
          </button>
        </div>

        <div className="text-center space-y-3">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button 
              className='text-blue-600 hover:text-blue-700 font-medium cursor-pointer'
              onClick={() => { setCurrentDialog('Signin') }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
      <p className='text-xs md:text-sm text-center text-gray-500 px-4'>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}

function SignupWithEmail({ setCurrentDialog, setEmail, email, sendLink, password, setPassword, username, setUsername, setUser, setIsOpen, redirect }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function signupHandler() {
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/user/register`, {
      email: email,
      password: password,
      username: username
    })
      .then((res) => {
        console.log(res.data);
        setUser(res.data.user);
        localStorage.setItem('OauthToken', res.data.accessToken);
        if (redirect) {
          window.opener.postMessage('oauth-complete', import.meta.env.VITE_CLIENT_BASE_URL);
          window.close();
        }
        toast.success('Account created successfully!');
        navigate('/home', { replace: true });
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to create account');
      });
  }

  return (
    <div className="flex flex-col justify-center items-center p-6 gap-4 w-full">
      <div className="content text-black flex flex-col gap-5 w-full">
        <div className="text-center mb-2">
          <div className='text-3xl md:text-4xl text-center flex justify-center items-center mb-2'>{icons.email}</div>
          <h2 className='text-xl md:text-2xl font-bold'>Create Developer Account</h2>
          <p className="text-gray-600 text-sm mt-1">Start building with our OAuth 2.0 API</p>
        </div>

        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              value={username}
              className={`w-full bg-gray-50 border rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${
                errors.username ? 'border-red-300 focus:ring-2 focus:ring-red-400' : 'border-gray-300 focus:ring-2 focus:ring-gray-400'
              }`}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email address"
              value={email}
              className={`w-full bg-gray-50 border rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${
                errors.email ? 'border-red-300 focus:ring-2 focus:ring-red-400' : 'border-gray-300 focus:ring-2 focus:ring-gray-400'
              }`}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Create a strong password"
              className={`w-full bg-gray-50 border rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${
                errors.password ? 'border-red-300 focus:ring-2 focus:ring-red-400' : 'border-gray-300 focus:ring-2 focus:ring-gray-400'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
        </div>

        <button
          className="w-full bg-black text-[#F7F4ED] font-medium rounded-lg py-3 px-5 cursor-pointer hover:bg-gray-800 transition-colors duration-200 mt-2"
          onClick={signupHandler}
        >
          Create Developer Account
        </button>

        <div className="text-center space-y-3">
          <button
            className='text-blue-600 hover:text-blue-700 text-sm cursor-pointer'
            onClick={() => { setCurrentDialog('DefaultDialog'); }}
          >
            ← Back to sign up options
          </button>
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              className='text-blue-600 hover:text-blue-700 font-medium cursor-pointer'
              onClick={() => { setCurrentDialog('SigninWithEmail') }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function SigninWithEmail({ setCurrentDialog, setEmail, email, password, setPassword, setUser, redirect, setIsOpen }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function signinHandler() {
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/user/login`, {
      email: email,
      password: password
    })
      .then((res) => {
        console.log(res.data);
        setUser(res.data.user);
        localStorage.setItem('OauthToken', res.data.accessToken);
        if (redirect) {
          window.opener.postMessage('oauth-complete', import.meta.env.VITE_CLIENT_BASE_URL);
          window.close();
        }
        toast.success('Welcome back!');
        navigate('/home', { replace: true });
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || 'Invalid email or password');
      });
  }

  return (
    <div className="flex flex-col justify-center items-center p-6 gap-4 w-full">
      <div className="content text-black flex flex-col gap-5 w-full">
        <div className="text-center mb-2">
          <div className='text-3xl md:text-4xl text-center flex justify-center items-center mb-2'>{icons.email}</div>
          <h2 className='text-xl md:text-2xl font-bold'>Sign in to JAuth</h2>
          <p className="text-gray-600 text-sm mt-1">Access your developer dashboard</p>
        </div>

        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email address"
              className={`w-full bg-gray-50 border rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${
                errors.email ? 'border-red-300 focus:ring-2 focus:ring-red-400' : 'border-gray-300 focus:ring-2 focus:ring-gray-400'
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className={`w-full bg-gray-50 border rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${
                errors.password ? 'border-red-300 focus:ring-2 focus:ring-red-400' : 'border-gray-300 focus:ring-2 focus:ring-gray-400'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
        </div>

        <button
          className="w-full bg-black text-[#F7F4ED] font-medium rounded-lg py-3 px-5 cursor-pointer hover:bg-gray-800 transition-colors duration-200 mt-2"
          onClick={signinHandler}
        >
          Sign in to Dashboard
        </button>

        <div className="text-center space-y-3">
          <button
            className='text-blue-600 hover:text-blue-700 text-sm cursor-pointer'
            onClick={() => { setCurrentDialog('DefaultDialog'); }}
          >
            ← Back to sign in options
          </button>
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              className='text-blue-600 hover:text-blue-700 font-medium cursor-pointer'
              onClick={() => { setCurrentDialog('SignupWithEmail') }}
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Signin({ setCurrentDialog }) {
  return (
    <div className="flex flex-col justify-center items-center p-6 gap-6 w-full">
      <div className="content text-black flex flex-col gap-6 w-full">
        <div className="text-center">
          <h2 className='text-2xl md:text-3xl font-bold mb-2'>Welcome Back</h2>
          <p className="text-gray-600">Sign in to your JAuth account</p>
        </div>

        <div className="space-y-4">
          <button
            className='w-full border-2 border-gray-300 rounded-xl px-4 py-3 flex items-center justify-center gap-4 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200'
            onClick={() => { setCurrentDialog('SigninWithEmail') }}
          >
            <span className="logo text-xl">{icons.email}</span>
            <span className="title font-medium">Continue with Email</span>
          </button>
        </div>

        <div className="text-center space-y-3">
          <p className="text-gray-600">
            No account?{' '}
            <button
              className='text-blue-600 hover:text-blue-700 font-medium cursor-pointer'
              onClick={() => { setCurrentDialog('DefaultDialog') }}
            >
              Create one
            </button>
          </p>
          <p className="text-gray-600 text-sm">
            <button className='text-blue-600 hover:text-blue-700 cursor-pointer'>
              Forgot password?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const LinkSent = ({ email }) => {
  return (
    <div className="flex flex-col justify-center items-center p-8 gap-6 text-center">
      <div className='text-4xl md:text-5xl text-center flex justify-center items-center mb-2'>{icons.email}</div>
      <h2 className='text-xl md:text-2xl font-bold'>Check Your Email</h2>
      <p className="text-gray-600 leading-relaxed">
        We've sent a verification link to <br />
        <strong>{email}</strong>
      </p>
      <p className="text-sm text-gray-500">
        Click the link in the email to complete your account setup and start using JAuth.
      </p>
    </div>
  );
};

export default Base;