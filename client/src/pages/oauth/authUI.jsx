import { useState } from 'react';
import { MdOutlineEmail } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/axios';

const email_icon = <MdOutlineEmail />;

const AuthUI = ({ onSuccess, loading }) => {
  const [currentDialog, setCurrentDialog] = useState('DefaultDialog');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
  };

  const dialog = {
    DefaultDialog: (
      <DefaultDialog setCurrentDialog={setCurrentDialog} />
    ),
    Signin: <Signin setCurrentDialog={setCurrentDialog} />,
    SignupWithEmail: (
      <SignupWithEmail
        setCurrentDialog={setCurrentDialog}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        username={username}
        setUsername={setUsername}
        onSuccess={onSuccess}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    ),
    SigninWithEmail: (
      <SigninWithEmail
        setCurrentDialog={setCurrentDialog}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSuccess={onSuccess}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    ),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={() => !isSubmitting && setCurrentDialog('DefaultDialog')}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[450px] rounded-2xl shadow-2xl overflow-hidden bg-white">
        {/* Close button */}
        <div className="flex justify-end p-4 border-b border-gray-100">
          <button
            onClick={() => {
              if (!isSubmitting) {
                setCurrentDialog('DefaultDialog');
                resetForm();
              }
            }}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 text-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          {dialog[currentDialog]}
        </div>
      </div>
    </div>
  );
};

export default AuthUI;

// DefaultDialog
function DefaultDialog({ setCurrentDialog }) {
  return (
    <div className="flex flex-col justify-center items-center gap-6 w-full">
      <div className="text-center">
        <div className="text-4xl sm:text-5xl text-blue-600 mb-4 flex justify-center">
          {email_icon}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome to JAuth
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Create your account or sign in to continue
        </p>
      </div>

      <div className="space-y-3 w-full">
        <button
          className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 sm:py-4 flex items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-medium text-gray-700"
          onClick={() => setCurrentDialog('SignupWithEmail')}
        >
          <span className="text-xl sm:text-2xl">{email_icon}</span>
          <span className="hidden sm:inline">Create Account with Email</span>
          <span className="sm:hidden">Create Account</span>
        </button>
      </div>

      <div className="text-center w-full">
        <p className="text-gray-600 text-sm sm:text-base">
          Already have an account?{' '}
          <button
            className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer transition-colors"
            onClick={() => setCurrentDialog('Signin')}
          >
            Sign in
          </button>
        </p>
      </div>

      <p className="text-xs text-center text-gray-500 px-4">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}

// Signin Dialog
function Signin({ setCurrentDialog }) {
  return (
    <div className="flex flex-col justify-center items-center gap-6 w-full">
      <div className="text-center">
        <div className="text-4xl sm:text-5xl text-blue-600 mb-4 flex justify-center">
          {email_icon}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Sign in to your JAuth account
        </p>
      </div>

      <div className="space-y-3 w-full">
        <button
          className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 sm:py-4 flex items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-medium text-gray-700"
          onClick={() => setCurrentDialog('SigninWithEmail')}
        >
          <span className="text-xl sm:text-2xl">{email_icon}</span>
          <span className="hidden sm:inline">Continue with Email</span>
          <span className="sm:hidden">Email</span>
        </button>
      </div>

      <div className="text-center space-y-2 w-full">
        <p className="text-gray-600 text-sm sm:text-base">
          No account?{' '}
          <button
            className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer transition-colors"
            onClick={() => setCurrentDialog('DefaultDialog')}
          >
            Create one
          </button>
        </p>
        <button className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer transition-colors">
          Forgot password?
        </button>
      </div>
    </div>
  );
}

// SignupWithEmail Dialog
function SignupWithEmail({
  setCurrentDialog,
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
}) {
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

  const signupHandler = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post(
        `/user/register`,
        {
          email: email.trim(),
          password: password,
          username: username.trim(),
        }
      );


        toast.success('Account created successfully!');

        // Small delay for visual feedback
        setTimeout(() => {
          onSuccess();
        }, 500);
    
    } catch (err) {
      console.error('Signup error:', err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Failed to create account'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full">
      <div className="text-center mb-2">
        <div className="text-4xl sm:text-5xl text-blue-600 flex justify-center mb-4">
          {email_icon}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Create Account
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm mt-2">
          Start building with our OAuth 2.0 API
        </p>
      </div>

      <div className="space-y-4 w-full">
        {/* Username */}
        <div className="form-group">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Username *
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
            className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.username
                ? 'border-red-300 focus:ring-2 focus:ring-red-400'
                : 'border-gray-300 focus:ring-2 focus:ring-blue-400'
            }`}
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.email
                ? 'border-red-300 focus:ring-2 focus:ring-red-400'
                : 'border-gray-300 focus:ring-2 focus:ring-blue-400'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password *
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.password
                ? 'border-red-300 focus:ring-2 focus:ring-red-400'
                : 'border-gray-300 focus:ring-2 focus:ring-blue-400'
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
      </div>

      <button
        onClick={signupHandler}
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white font-semibold rounded-lg py-2.5 sm:py-3 px-5 cursor-pointer hover:bg-blue-700 transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Creating account...
          </>
        ) : (
          'Create Developer Account'
        )}
      </button>

      <div className="text-center space-y-3 w-full">
        <button
          onClick={() => setCurrentDialog('DefaultDialog')}
          disabled={isSubmitting}
          className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer transition-colors disabled:opacity-50"
        >
          ← Back to sign up options
        </button>
        <p className="text-gray-600 text-xs sm:text-sm">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentDialog('SigninWithEmail')}
            disabled={isSubmitting}
            className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer transition-colors disabled:opacity-50"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

// SigninWithEmail Dialog
function SigninWithEmail({
  setCurrentDialog,
  email,
  setEmail,
  password,
  setPassword,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
}) {
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

  const signinHandler = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post(
        `/user/login`,
        {
          email: email.trim(),
          password: password,
        }
      );

        toast.success('Welcome back!');

        setTimeout(() => {
          onSuccess();
        }, 500);
    } catch (err) {
      console.error('Signin error:', err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Invalid email or password'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full">
      <div className="text-center mb-2">
        <div className="text-4xl sm:text-5xl text-blue-600 flex justify-center mb-4">
          {email_icon}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Sign in to JAuth
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm mt-2">
          Access your developer dashboard
        </p>
      </div>

      <div className="space-y-4 w-full">
        {/* Email */}
        <div className="form-group">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.email
                ? 'border-red-300 focus:ring-2 focus:ring-red-400'
                : 'border-gray-300 focus:ring-2 focus:ring-blue-400'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password *
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.password
                ? 'border-red-300 focus:ring-2 focus:ring-red-400'
                : 'border-gray-300 focus:ring-2 focus:ring-blue-400'
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
      </div>

      <button
        onClick={signinHandler}
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white font-semibold rounded-lg py-2.5 sm:py-3 px-5 cursor-pointer hover:bg-blue-700 transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </button>

      <div className="text-center space-y-3 w-full">
        <button
          onClick={() => setCurrentDialog('DefaultDialog')}
          disabled={isSubmitting}
          className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer transition-colors disabled:opacity-50"
        >
          ← Back to sign in options
        </button>
        <p className="text-gray-600 text-xs sm:text-sm">
          Don't have an account?{' '}
          <button
            onClick={() => setCurrentDialog('SignupWithEmail')}
            disabled={isSubmitting}
            className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer transition-colors disabled:opacity-50"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
