import React from 'react';
import { X } from 'lucide-react';

interface NodeSelectorProps {
  visible: boolean;
  onSelect: (nodeType: 'api' | 'email' | 'textbox') => void;
  onClose: () => void;
  isFirstNode: boolean;
}

const NodeSelector: React.FC<NodeSelectorProps> = ({ visible, onClose, onSelect, isFirstNode }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute right-[94px] top-24 bg-white rounded-2xl shadow-lg p-4 max-w-[200px]">
        <div className="flex flex-col gap-3">
          <button 
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50 text-left"
            onClick={() => onSelect('api')}
          >
            API Call
          </button>

          <button 
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50 text-left"
            onClick={() => onSelect('email')}
          >
            Email
          </button>

          <button 
            className={`w-full px-4 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50 text-left ${!isFirstNode ? '' : 'opacity-50 cursor-not-allowed'}`}
            onClick={() => !isFirstNode && onSelect('textbox')}
            disabled={isFirstNode}
          >
            Text Box
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeSelector;