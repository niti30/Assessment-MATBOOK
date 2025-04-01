
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TextBoxConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { message: string }) => void;
}

const TextBoxConfigModal: React.FC<TextBoxConfigModalProps> = ({ isOpen, onClose, onSave }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ message });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-sm absolute right-5 top-24">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Configuration</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              placeholder="Enter..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl min-h-[150px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600"
              disabled={!message.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextBoxConfigModal;
