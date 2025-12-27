import { useState } from 'react';
import { 
  IoEye, 
  IoEyeOff, 
  IoCopy, 
  IoTrashOutline,
  IoPencilOutline,
  IoCheckmark,
  IoClose
} from 'react-icons/io5';
import { toast } from 'react-toastify';
import api from '../../../api/axios';

function AppTemplate({ 
  app, 
  onEdit, 
  onDelete, 
  onToggleActive,
  onCopy 
}) {
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerateSecret = async () => {
    setIsRegenerating(true);
    try {
      const res = await api.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/user/credentials/${app._id}/regenerate-secret`
      );
      app.clientSecret = res.data.clientSecret;
      toast.success('Client secret regenerated successfully');
      setShowRegenerateModal(false);
      setShowClientSecret(true);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || 'Failed to regenerate client secret'
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const isActive = app.isActive === 'true' || app.isActive === true;
  const appTitle = app.appName || app.appName || 'Untitled application';

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {appTitle}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 break-all">
                ID:{' '}
                <span className="font-mono text-[11px] sm:text-xs text-gray-700">
                  {app._id}
                </span>
              </p>
            </div>

            <div className="flex items-center sm:justify-end">
              {isActive ? (
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded text-[11px] sm:text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-2.5 py-1 rounded text-[11px] sm:text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  Inactive
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-5 space-y-5">
          <div>
            <label className="block text-[11px] sm:text-xs font-medium text-gray-600 mb-2">
              Client ID
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="text"
                value={app.clientId}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs sm:text-sm font-mono text-gray-700 focus:outline-none"
              />
              <button
                onClick={() => onCopy(app.clientId, 'Client ID')}
                className="self-start sm:self-auto p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="Copy Client ID"
              >
                <IoCopy className="text-lg" />
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <label className="block text-[11px] sm:text-xs font-medium text-gray-600">
                Client Secret
              </label>
              <button
                onClick={() => setShowRegenerateModal(true)}
                className="text-[11px] sm:text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors self-start sm:self-auto"
              >
                Regenerate
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type={showClientSecret ? 'text' : 'password'}
                value={app.clientSecret}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs sm:text-sm font-mono text-gray-700 focus:outline-none"
              />
              <div className="flex flex-row sm:flex-row gap-2">
                <button
                  onClick={() => setShowClientSecret(!showClientSecret)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  title={showClientSecret ? 'Hide' : 'Show'}
                >
                  {showClientSecret ? (
                    <IoEyeOff className="text-lg" />
                  ) : (
                    <IoEye className="text-lg" />
                  )}
                </button>
                <button
                  onClick={() => onCopy(app.clientSecret, 'Client Secret')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  title="Copy Client Secret"
                >
                  <IoCopy className="text-lg" />
                </button>
              </div>
            </div>
          </div>

          {app.originUrls?.length > 0 && (
            <div>
              <label className="block text-[11px] sm:text-xs font-medium text-gray-600 mb-2">
                Origin URLs ({app.originUrls.length})
              </label>
              <div className="space-y-1.5">
                {app.originUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 border border-gray-200 hover:border-gray-300 transition-colors group"
                  >
                    <span className="text-[11px] sm:text-xs font-mono text-gray-700 truncate flex-1">
                      {url}
                    </span>
                    <button
                      onClick={() => onCopy(url, 'URL copied')}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IoCopy className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {app.redirectUrls?.length > 0 && (
            <div>
              <label className="block text-[11px] sm:text-xs font-medium text-gray-600 mb-2">
                Redirect URLs ({app.redirectUrls.length})
              </label>
              <div className="space-y-1.5">
                {app.redirectUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 border border-gray-200 hover:border-gray-300 transition-colors group"
                  >
                    <span className="text-[11px] sm:text-xs font-mono text-gray-700 truncate flex-1">
                      {url}
                    </span>
                    <button
                      onClick={() => onCopy(url, 'URL copied')}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IoCopy className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-gray-100 gap-1">
            <p className="text-[11px] sm:text-xs text-gray-500">
              Created{' '}
              {new Date(app.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row flex-wrap gap-2 justify-end">
          <button
            onClick={() => onToggleActive(app._id, isActive)}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors ${
              isActive
                ? 'text-orange-700 bg-orange-50 hover:bg-orange-100'
                : 'text-green-700 bg-green-50 hover:bg-green-100'
            }`}
          >
            {isActive ? (
              <IoClose className="text-base" />
            ) : (
              <IoCheckmark className="text-base" />
            )}
            {isActive ? 'Deactivate' : 'Activate'}
          </button>

          <button
            onClick={() => onEdit(app)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <IoPencilOutline className="text-base" />
            Edit
          </button>

          <button
            onClick={() => onDelete(app._id)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs sm:text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <IoTrashOutline className="text-base" />
            Delete
          </button>
        </div>
      </div>

      {showRegenerateModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Regenerate Client Secret?
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                This will invalidate the current secret. Make sure to update your application with the new secret immediately.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
                <p className="text-xs text-yellow-800">
                  Any active sessions using the old secret will be invalidated.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowRegenerateModal(false)}
                  disabled={isRegenerating}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegenerateSecret}
                  disabled={isRegenerating}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isRegenerating ? (
                    <>
                      <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Regenerating
                    </>
                  ) : (
                    'Regenerate'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AppTemplate;
