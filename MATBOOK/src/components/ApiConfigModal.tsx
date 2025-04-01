
import React, { useState } from 'react';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

const ApiConfigModal: React.FC<ApiConfigModalProps> = ({ isOpen, onClose, onSave }) => {
  const [config, setConfig] = useState({
    method: 'GET',
    url: '',
    headers: '{}',
    body: '{}'
  });

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const parsedHeaders = JSON.parse(config.headers);
      const parsedBody = JSON.parse(config.body);
      onSave({
        ...config,
        headers: parsedHeaders,
        body: parsedBody
      });
    } catch (error) {
      console.error('Invalid JSON in headers or body');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm mr-5">
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-medium">API Configuration</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Method</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                value={config.method}
                onChange={(e) => setConfig({ ...config, method: e.target.value })}
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">URL</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Headers (JSON)</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                rows={3}
                value={config.headers}
                onChange={(e) => setConfig({ ...config, headers: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Body (JSON)</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                rows={3}
                value={config.body}
                onChange={(e) => setConfig({ ...config, body: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConfigModal;
