

import { useState } from "react";
import { FiEdit2, FiTrash2, FiCopy, FiCheckCircle } from "react-icons/fi";

const AppTemplate = ({ app, onEdit, onDelete, onCopy, onRegenerateSecret }) => {
  const [copied, setCopied] = useState("");
  const handleCopy = (value, label) => {
    onCopy(value);
    setCopied(label);
    setTimeout(() => setCopied(""), 1200);
  };
  return (
    <div className="app-card bg-white rounded-2xl border border-gray-200 p-6 w-full shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 truncate">{app.appName}</h3>
          <p className="text-xs text-gray-500 mt-1">App ID: <span className="font-mono">{app._id}</span></p>
        </div>
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
          <span className="label font-semibold text-gray-700 text-sm">Origin URL:</span>
          <div className="value-container flex items-center gap-2 mt-1">
            <span className="value text-gray-900 break-all text-sm">{app.originUrl}</span>
            <button
              onClick={() => handleCopy(app.originUrl, "originUrl")}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              title="Copy URL"
            >
              {copied === "originUrl" ? <FiCheckCircle className="text-green-500 text-sm" /> : <FiCopy className="text-sm" />}
            </button>
          </div>
        </div>
        
        <div className="info-item">
          <span className="label font-semibold text-gray-700 text-sm">Redirect URL:</span>
          <div className="value-container flex items-center gap-2 mt-1">
            <span className="value text-gray-900 break-all text-sm">{app.redirectUrl}</span>
            <button
              onClick={() => handleCopy(app.redirectUrl, "redirectUrl")}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              title="Copy URL"
            >
              {copied === "redirectUrl" ? <FiCheckCircle className="text-green-500 text-sm" /> : <FiCopy className="text-sm" />}
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
                onClick={() => handleCopy(app.clientId, "clientId")}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title="Copy Client ID"
              >
                {copied === "clientId" ? <FiCheckCircle className="text-green-500 text-sm" /> : <FiCopy className="text-sm" />}
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
                  onClick={() => handleCopy(app.clientSecret, "clientSecret")}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  title="Copy Client Secret"
                >
                  {copied === "clientSecret" ? <FiCheckCircle className="text-green-500 text-sm" /> : <FiCopy className="text-sm" />}
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