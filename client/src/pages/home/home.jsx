import { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authContext } from '../../contexts/authContext';
import AppTemplate from './components/appTemplate';
import Loader from '../../components/loader';
import {
  IoAddCircleOutline,
  IoSearchOutline,
  IoClose,
} from 'react-icons/io5';
import api from '../../api/axios';

function Home() {
  const { user, logout } = useContext(authContext);
  const [isOpen, setIsOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredApps, setFilteredApps] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function getData() {
    setLoading(true);
    api
      .get(`/user/getApps?userId=${user._id}`)
      .then((res) => {
        if (res.status === 203 || !res.data) {
          setMyApps([]);
        } else {
          setMyApps(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error('Failed to load applications');
      });
  }

  useEffect(() => {
    const filtered = myApps.filter((app) =>
      (app.appName || app.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredApps(filtered);
  }, [searchQuery, myApps]);

  const handleEdit = (app) => {
    setEditingApp(app);
    setIsOpen(true);
  };

  const handleDeleteClick = (app) => {
    setDeleteTarget(app);
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await api.delete(`/user/credentials/${deleteTarget._id}`);
      toast.success('Application deleted successfully');
      setDeleteTarget(null);
      getData();
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || 'Failed to delete application'
      );
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleToggleActive = async (appId, currentStatus) => {
    try {
      await api.patch(`/user/credentials/${appId}/toggle-status`, {
        isActive: !currentStatus,
      });
      toast.success(
        `Application ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      );
      getData();
    } catch (err) {
      console.log(err);
      toast.error('Failed to update application status');
    }
  };

  const handleCopy = (text, label = 'Copied') => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} to clipboard!`);
  };

  useEffect(() => {
    getData();
  }, [user._id]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <header className="fixed top-0 left-0 w-full bg-black text-[#F7F4ED] h-[70px] border-b-2 border-[#F7F4ED] shadow-lg z-40">
        <div className="container mx-auto px-4 h-full flex justify-between items-center max-w-[1400px]">
          <div className="text-2xl md:text-3xl font-extrabold tracking-tight">
            OAuth
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <button
              className="inline-flex items-center gap-2 text-black bg-[#F7F4ED] px-4 md:px-6 py-2 rounded-xl font-medium text-sm md:text-base hover:bg-white transition-all duration-200"
              onClick={() => {
                setEditingApp(null);
                setIsOpen(true);
                setSearchQuery('');
              }}
            >
              <IoAddCircleOutline className="text-lg" />
              <span className="hidden sm:inline">Create App</span>
              <span className="sm:hidden">New</span>
            </button>
            <button
              className="text-black bg-[#F7F4ED] px-4 md:px-6 py-2 rounded-xl font-medium text-sm md:text-base hover:bg-white transition-all duration-200"
              onClick={logout}
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-[#F7F4ED] pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                My Applications
              </h1>
              <p className="text-black/70 text-lg">
                Manage your OAuth 2.0 applications and credentials
              </p>
            </div>

            {myApps.length > 0 && (
              <div className="mb-8">
                <div className="relative">
                  <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/40 text-xl" />
                  <input
                    type="text"
                    placeholder="Search applications by appName..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-black/10 rounded-xl pl-12 pr-4 py-3 text-base focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black/40 hover:text-black"
                    >
                      <IoClose className="text-xl" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-black/60 mt-2">
                  Found {filteredApps.length} application
                  {filteredApps.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {filteredApps.length > 0 ? (
              <div className="space-y-4">
                {filteredApps.map((app) => (
                  <AppTemplate
                    key={app._id}
                    app={app}
                    onEdit={handleEdit}
                    onDelete={() => handleDeleteClick(app)}
                    onToggleActive={handleToggleActive}
                    onCopy={handleCopy}
                  />
                ))}
              </div>
            ) : myApps.length === 0 ? (
              <EmptyState onCreateClick={() => setIsOpen(true)} />
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  No applications found
                </h3>
                <p className="text-black/70">
                  Try adjusting your search query
                </p>
              </div>
            )}

            {isOpen && (
              <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/60">
                <div className="bg-[#F7F4ED] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DefaultDialog
                    setIsOpen={setIsOpen}
                    user={user}
                    getData={getData}
                    editingApp={editingApp}
                    setEditingApp={setEditingApp}
                  />
                </div>
              </div>
            )}

            {deleteTarget && (
              <DeleteConfirmOverlay
                app={deleteTarget}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function EmptyState({ onCreateClick }) {
  return (
    <div className="text-center py-20">
      <div className="mb-6">
        <IoAddCircleOutline className="text-7xl mx-auto text-black/10" />
      </div>
      <h3 className="text-2xl font-bold text-black mb-2">
        No applications yet
      </h3>
      <p className="text-black/70 mb-8 max-w-md mx-auto">
        Create your first OAuth application to start managing credentials and
        integrations.
      </p>
      <button
        className="inline-flex items-center gap-2 text-black bg-[#F7F4ED] px-8 py-3 rounded-xl font-medium text-lg hover:bg-white transition-all duration-200 border border-black/10"
        onClick={onCreateClick}
      >
        <IoAddCircleOutline className="text-xl" />
        Create Your First App
      </button>
    </div>
  );
}

function DeleteConfirmOverlay({ app, onCancel, onConfirm }) {
  const title = app.appName || app.name || 'this application';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md bg-[#F7F4ED] rounded-2xl shadow-2xl p-6">
        <h3 className="text-xl font-bold text-black mb-3">
          Delete application?
        </h3>
        <p className="text-sm text-black/80 mb-4">
          You are about to delete{' '}
          <span className="font-semibold">{title}</span>. This action cannot be
          undone.
        </p>
        <p className="text-xs text-black/60 mb-6 break-all">
          ID: <span className="font-mono">{app._id}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg border border-black/20 text-sm font-medium text-black bg-white hover:bg-[#F7F4ED] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-[#F7F4ED] bg-black hover:bg-black/90 transition-colors"
          >
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  );
}

function DefaultDialog({ setIsOpen, user, getData, editingApp, setEditingApp }) {
  const [form, setForm] = useState({
    appName: '',
    originUrls: [''],
    redirectUrls: [''],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingApp) {
      setForm({
        appName: editingApp.appName || editingApp.name || '',
        originUrls: editingApp.originUrls || [''],
        redirectUrls: editingApp.redirectUrls || [''],
      });
    } else {
      setForm({
        appName: '',
        originUrls: [''],
        redirectUrls: [''],
      });
    }
    setErrors({});
  }, [editingApp]);

  const validateURL = (url) => {
    if (!url.trim()) return true;
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

    if (!form.originUrls[0]?.trim()) {
      newErrors.originUrls = 'At least one origin URL is required';
    } else if (!validateURL(form.originUrls[0])) {
      newErrors.originUrls = 'Please enter a valid URL (http:// or https://)';
    }

    form.originUrls.forEach((url, idx) => {
      if (url.trim() && !validateURL(url)) {
        newErrors.originUrls = `Origin URL ${idx + 1} is invalid`;
      }
    });

    if (!form.redirectUrls[0]?.trim()) {
      newErrors.redirectUrls = 'At least one redirect URL is required';
    } else if (!validateURL(form.redirectUrls[0])) {
      newErrors.redirectUrls =
        'Please enter a valid URL (http:// or https://)';
    }

    form.redirectUrls.forEach((url, idx) => {
      if (url.trim() && !validateURL(url)) {
        newErrors.redirectUrls = `Redirect URL ${idx + 1} is invalid`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddField = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleRemoveField = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleFieldChange = (field, index, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  async function submitHandler() {
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);

    const url = editingApp
      ? `${import.meta.env.VITE_SERVER_BASE_URL}/user/credentials/${editingApp._id}`
      : `${import.meta.env.VITE_SERVER_BASE_URL}/user/credentials/create`;

    const method = editingApp ? 'put' : 'post';

    const payload = {
      appName: form.appName,
      originUrls: form.originUrls.filter((url) => url.trim()),
      redirectUrls: form.redirectUrls.filter((url) => url.trim()),
      scope: 'all-credentials',
      userId: user._id,
    };

    try {
      await api[method](url, payload);
      toast.success(
        editingApp
          ? 'Application updated successfully'
          : 'Application created successfully'
      );
      setIsOpen(false);
      setEditingApp(null);
      getData();
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message ||
          (editingApp
            ? 'Failed to update application'
            : 'Failed to create application')
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          {editingApp ? 'Edit Application' : 'Create New App'}
        </h2>
        <button
          onClick={() => {
            setIsOpen(false);
            setEditingApp(null);
          }}
          className="text-black/50 hover:text-black text-3xl font-bold p-1 rounded-full hover:bg-white transition-colors duration-200"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        <div className="form-group">
          <label
            htmlFor="appName"
            className="block text-sm font-semibold text-black mb-2"
          >
            Application name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="appName"
            id="appName"
            placeholder="e.g., My Web App"
            className={`w-full bg-white border border-black/15 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 ${
              errors.appName ? 'border-red-500' : ''
            }`}
            value={form.appName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, appName: e.target.value }))
            }
          />
          {errors.appName && (
            <p className="text-red-500 text-sm mt-1">{errors.appName}</p>
          )}
        </div>

        <div className="form-group">
          <label className="block text-sm font-semibold text-black mb-3">
            Origin URLs <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-black/70 mb-3">
            URLs where your application is hosted
          </p>
          <div className="space-y-2">
            {form.originUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://yourapp.com"
                  className={`flex-1 bg-white border border-black/15 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 ${
                    errors.originUrls && index === 0 ? 'border-red-500' : ''
                  }`}
                  value={url}
                  onChange={(e) =>
                    handleFieldChange('originUrls', index, e.target.value)
                  }
                />
                {form.originUrls.length > 1 && (
                  <button
                    onClick={() => handleRemoveField('originUrls', index)}
                    className="bg-black text-[#F7F4ED] px-4 py-3 rounded-lg font-medium text-sm hover:bg-black/90 transition-colors duration-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.originUrls && (
            <p className="text-red-500 text-sm mt-2">{errors.originUrls}</p>
          )}
          <button
            type="button"
            onClick={() => handleAddField('originUrls')}
            className="mt-3 text-sm font-medium text-black border border-black/20 px-4 py-2 rounded-lg hover:bg-white transition-colors duration-200"
          >
            + Add Another URL
          </button>
        </div>

        <div className="form-group">
          <label className="block text-sm font-semibold text-black mb-3">
            Redirect URLs (Callback) <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-black/70 mb-3">
            Where users are redirected after authentication
          </p>
          <div className="space-y-2">
            {form.redirectUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://yourapp.com/callback"
                  className={`flex-1 bg-white border border-black/15 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 ${
                    errors.redirectUrls && index === 0 ? 'border-red-500' : ''
                  }`}
                  value={url}
                  onChange={(e) =>
                    handleFieldChange('redirectUrls', index, e.target.value)
                  }
                />
                {form.redirectUrls.length > 1 && (
                  <button
                    onClick={() => handleRemoveField('redirectUrls', index)}
                    className="bg-black text-[#F7F4ED] px-4 py-3 rounded-lg font-medium text-sm hover:bg-black/90 transition-colors duration-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.redirectUrls && (
            <p className="text-red-500 text-sm mt-2">
              {errors.redirectUrls}
            </p>
          )}
          <button
            type="button"
            onClick={() => handleAddField('redirectUrls')}
            className="mt-3 text-sm font-medium text-black border border-black/20 px-4 py-2 rounded-lg hover:bg-white transition-colors duration-200"
          >
            + Add Another URL
          </button>
        </div>

        <button
          className="w-full bg-black hover:bg-black/90 text-[#F7F4ED] font-semibold rounded-lg py-3 px-5 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          onClick={submitHandler}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-[#F7F4ED] border-t-transparent rounded-full animate-spin" />
              {editingApp ? 'Updating...' : 'Creating...'}
            </span>
          ) : editingApp ? (
            'Update Application'
          ) : (
            'Create Application'
          )}
        </button>
      </div>
    </div>
  );
}

export default Home;
