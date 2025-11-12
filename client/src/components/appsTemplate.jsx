

import { FiEdit2, FiTrash2, FiCopy } from "react-icons/fi";


const AppTemplate = ({ app, onEdit, onDelete, onCopy, onRegenerateSecret }) => {
  return (
    <div className="app-card bg-white rounded-xl border border-gray-200 p-6 w-full shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 truncate">{app.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(app)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            title="Edit application"
          >
            <FiEdit2 className="text-lg" />
          </button>
          <button
            onClick={() => onDelete(app._id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Delete application"
          >
            <FiTrash2 className="text-lg" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="info-item">
          <span className="label font-semibold text-gray-700 text-sm">Homepage URL:</span>
          <div className="value-container flex items-center gap-2 mt-1">
            <span className="value text-gray-900 break-all text-sm">{app.home}</span>
            <button
              onClick={() => onCopy(app.home)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              title="Copy URL"
            >
              <FiCopy className="text-sm" />
            </button>
          </div>
        </div>
        
        <div className="info-item">
          <span className="label font-semibold text-gray-700 text-sm">Callback URL:</span>
          <div className="value-container flex items-center gap-2 mt-1">
            <span className="value text-gray-900 break-all text-sm">{app.callback}</span>
            <button
              onClick={() => onCopy(app.callback)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              title="Copy URL"
            >
              <FiCopy className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      <div className="credentials-section border-t border-gray-100 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="credential-item">
            <div className="flex justify-between items-center mb-2">
              <span className="label font-semibold text-gray-700 text-sm">Client ID:</span>
              <button
                onClick={() => onCopy(app.clientId)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title="Copy Client ID"
              >
                <FiCopy className="text-sm" />
              </button>
            </div>
            <code className="value text-gray-900 break-all font-mono text-xs bg-gray-50 px-2 py-1 rounded border">
              {app.clientId}
            </code>
          </div>
          
          <div className="credential-item">
            <div className="flex justify-between items-center mb-2">
              <span className="label font-semibold text-gray-700 text-sm">Client Secret:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => onCopy(app.clientSecret)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  title="Copy Client Secret"
                >
                  <FiCopy className="text-sm" />
                </button>
                <button
                  onClick={() => onRegenerateSecret(app._id)}
                  className="p-1 text-gray-400 hover:text-orange-600 transition-colors duration-200"
                  title="Regenerate Client Secret"
                >
                  <FiEdit2 className="text-sm" />
                </button>
              </div>
            </div>
            <code className="value text-gray-900 break-all font-mono text-xs bg-gray-50 px-2 py-1 rounded border">
              {app.clientSecret}
            </code>
            <p className="text-xs text-gray-500 mt-1">Keep this secret safe!</p>
          </div>
        </div>
      </div>

      <div className="metadata-section border-t border-gray-100 pt-4 mt-4">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Created: {new Date(app.createdAt || Date.now()).toLocaleDateString()}</span>
          <span>Status: <span className="text-green-600 font-medium">Active</span></span>
        </div>
      </div>
    </div>
  );
};

export default AppTemplate;