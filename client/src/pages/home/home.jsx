import { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authContext } from '../../contexts/authContext';
import AppTemplate from './components/appsTemplate';
import Loader from '../../components/loader';
import {IoAddCircleOutline } from "react-icons/io5";
import api from "../../api/axios";


function Home() {
  const { user, logout } = useContext(authContext);
  const [isOpen, setIsOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);

  function getData() {
    api.get(`/user/getApps?userId=${user._id}`)
      .then((res) => {
        if (res.status === 203) {
          setLoading(false);
        } else {
          setMyApps(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error('Failed to load applications');
      });
  }

  const handleEdit = (app) => {
    setEditingApp(app);
    setIsOpen(true);
  };

  const handleDelete = async (appId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await api.delete(`/user/credentials/${appId}`);
        toast.success('Application deleted successfully');
        getData();
      } catch (err) {
        console.log(err);
        toast.error('Failed to delete application');
      }
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleRegenerateSecret = async (appId) => {
    if (window.confirm('Are you sure you want to regenerate the client secret? This will invalidate the old one.')) {
      try {
        await api.post(`/user/credentials/${appId}/regenerate-secret`);
        toast.success('Client secret regenerated successfully');
        getData();
      } catch (err) {
        console.log(err);
        toast.error('Failed to regenerate client secret');
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className='header bg-black text-[#F7F4ED] h-[70px] flex items-center justify-center w-full border-[#F7F4ED] border-b-2 shadow-sm fixed top-0 left-0 z-40'>
        <div className="container w-[90%] max-w-[1200px] flex justify-between items-center">
          <div className="left text-[24px] md:text-[26px] cursor-pointer font-extrabold">OAuth</div>
          <div className="right text-[#F7F4ED] text-[16px] md:text-[18px] cursor-pointer flex items-center gap-4 md:gap-6">
            <button 
              className="inline-flex items-center gap-2 text-black bg-[#F7F4ED] text-[16px] md:text-[18px] rounded-xl py-2 px-4 cursor-pointer hover:bg-gray-200 transition-colors duration-200"
              onClick={() => {
                setEditingApp(null);
                setIsOpen(true);
              }}
            >
              <IoAddCircleOutline className="text-lg" />
              Create App
            </button>
            <button 
              className="inline-flex items-center text-black bg-[#F7F4ED] text-[16px] md:text-[18px] rounded-xl py-2 px-4 cursor-pointer hover:bg-gray-200 transition-colors duration-200"
              onClick={() => { logout() }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="body flex justify-center w-full min-h-screen bg-[#F7F4ED] pt-24 pb-8">
          <div className="mainContent text-black flex flex-col w-[90%] max-w-[1200px]">
            <div className="header-section mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-600 mt-2">Manage your OAuth applications and credentials</p>
            </div>

            {myApps?.length > 0 ? (
              <div className="apps-grid space-y-6">
                {myApps.map((app, index) => (
                  <AppTemplate 
                    key={app._id || index} 
                    app={app} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCopy={handleCopy}
                    onRegenerateSecret={handleRegenerateSecret}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state text-center py-12">
                <div className="empty-icon text-gray-400 mb-4">
                  <IoAddCircleOutline className="text-6xl mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No applications yet</h3>
                <p className="text-gray-600 mb-6">Create your first OAuth application to get started</p>
                <button 
                  className="inline-flex items-center gap-2 text-black bg-[#F7F4ED] text-[16px] rounded-xl py-2 px-6 cursor-pointer hover:bg-gray-200 transition-colors duration-200 border border-gray-300"
                  onClick={() => setIsOpen(true)}
                >
                  <IoAddCircleOutline className="text-lg" />
                  Create Your First App
                </button>
              </div>
            )}

            {isOpen && (
              <div className="fixed inset-0 z-50 flex justify-center items-center bg-transparent backdrop-blur-lg p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <DefaultDialog 
                      setIsOpen={setIsOpen} 
                      user={user} 
                      getData={getData}
                      editingApp={editingApp}
                      setEditingApp={setEditingApp}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function DefaultDialog({ setIsOpen, user, getData, editingApp, setEditingApp }) {
  const [form, setForm] = useState({ 
    name: '', 
    home: '', 
    callback: '', 
    userId: user._id, 
    scope: 'all-credentials' 
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingApp) {
      setForm({
        name: editingApp.name,
        home: editingApp.home,
        callback: editingApp.callback,
        userId: user._id,
        scope: editingApp.scope || 'all-credentials'
      });
    } else {
      setForm({
        appName: '', 
        originUrl: '', 
        redirectUrl: '', 
        userId: user._id, 
        scope: 'all-credentials'
      });
    }
    setErrors({});
  }, [editingApp, user._id]);

  const validateURL = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.appName.trim()) {
      newErrors.appName = 'Application name is required';
    }

    if (!form.originUrl.trim()) {
      newErrors.originUrl = 'Homepage URL is required';
    } else if (!validateURL(form.originUrl)) {
      newErrors.originUrl = 'Please enter a valid URL (http:// or https://)';
    }

    if (!form.redirectUrl.trim()) {
      newErrors.redirectUrl = 'Callback URL is required';
    } else if (!validateURL(form.redirectUrl)) {
      newErrors.redirectUrl = 'Please enter a valid URL (http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function submitHandler() {
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    const url = editingApp 
      ? `${import.meta.env.VITE_SERVER_BASE_URL}/user/credentials/${editingApp._id}`
      : `${import.meta.env.VITE_SERVER_BASE_URL}/user/credentials/create`;

    const method = editingApp ? 'put' : 'post';

    api[method](url, form)
      .then((res) => {
        toast.success(editingApp ? 'Application updated successfully' : 'Application created successfully');
        setIsOpen(false);
        setEditingApp(null);
        getData();
      })
      .catch((err) => {
        console.log(err);
        toast.error(editingApp ? 'Failed to update application' : 'Failed to create application');
      });
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {editingApp ? 'Edit Application' : 'Create New App'}
        </h2>
        <button 
          onClick={() => {
            setIsOpen(false);
            setEditingApp(null);
          }} 
          className="text-gray-500 hover:text-gray-700 text-xl font-bold p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="form-group">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Application Name *
          </label>
          <input 
            type="text" 
            name="appName" 
            id="appName" 
            placeholder="Enter your application name" 
            className={`w-full bg-gray-50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
              errors.appName ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-gray-400'
            }`}
            value={form.appName} 
            onChange={(e) => setForm(prev => ({ ...prev, appName: e.target.value }))}
          />
          {errors.appName && <p className="text-red-500 text-sm mt-1">{errors.appName}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="originUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Origin URL *
          </label>
          <input 
            type="text" 
            name="originUrl" 
            id="originUrl" 
            placeholder="https://yourapp.com" 
            className={`w-full bg-gray-50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
              errors.originUrl ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-gray-400'
            }`}
            value={form.originUrl} 
            onChange={(e) => setForm(prev => ({ ...prev, originUrl: e.target.value }))}
          />
          {errors.originUrl && <p className="text-red-500 text-sm mt-1">{errors.originUrl}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="redirectUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Redirect URL *
          </label>
          <input 
            type="text" 
            name="redirectUrl" 
            id="redirectUrl" 
            placeholder="https://yourapp.com/callback" 
            className={`w-full bg-gray-50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
              errors.redirectUrl ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-gray-400'
            }`}
            value={form.redirectUrl} 
            onChange={(e) => setForm(prev => ({ ...prev, redirectUrl: e.target.value }))}
          />
          {errors.redirectUrl && <p className="text-red-500 text-sm mt-1">{errors.redirectUrl}</p>}
        </div>
        
        <button 
          className="w-full bg-black text-[#F7F4ED] text-[16px] font-medium rounded-lg py-3 px-5 cursor-pointer hover:bg-gray-800 transition-colors duration-200 mt-4"
          onClick={submitHandler}
        >
          {editingApp ? 'Update Application' : 'Create Application'}
        </button>
      </div>
    </div>
  );
}

export default Home;