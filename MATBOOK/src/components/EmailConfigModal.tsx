import React, { useState } from 'react';
import { X } from 'lucide-react';

interface EmailConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { emailContent: string }) => void;
}

const EmailConfigModal: React.FC<EmailConfigModalProps> = ({ isOpen, onClose, onSave }) => {
  const [emailContent, setEmailContent] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ emailContent });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-sm absolute right-5 top-24"> {/* Modified class for smaller size and positioning */}
        {/* Removed the red sidebar */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Email</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <textarea
              placeholder="Type here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md min-h-[150px]"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600"
              disabled={!emailContent.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfigModal;