import React from 'react';
import { CheckCircle, Trash, Check } from 'lucide-react';

interface WorkflowNodeProps {
  type: 'start' | 'end' | 'api' | 'email' | 'textbox';
  status?: 'success' | 'error' | 'pending';
  onDelete?: () => void;
  onConfigure?: () => void;
}

const WorkflowNode: React.FC<WorkflowNodeProps> = ({ type, status = 'pending', onDelete, onConfigure }) => {
  const getNodeContent = () => {
    switch (type) {
      case 'start':
        return (
          <div className="w-20 h-20 rounded-full bg-highbridge-green flex items-center justify-center border-2 border-white shadow-md">
            <span className="text-white font-semibold">Start</span>
          </div>
        );
      case 'end':
        return (
          <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center border-2 border-white shadow-md">
            <span className="text-white font-semibold">End</span>
          </div>
        );
      default:
        return (
          <div 
            className={`px-6 py-4 bg-white border ${status === 'success' ? 'border-green-500' : 'border-gray-200'} rounded-2xl w-80 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer`} //Rounded corners added here.
            onClick={onConfigure}
          >
            <div className="flex items-center">
              <span className="font-medium">
                {type === 'api' ? 'API Call' : type === 'email' ? 'Email' : 'Text Box'}
              </span>
            </div>

            {status === 'success' ? (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            ) : (
              onDelete && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }} 
                  className="text-red-500"
                >
                  <Trash size={18} />
                </button>
              )
            )}
          </div>
        );
    }
  };

  return (
    <div>
      {getNodeContent()}
    </div>
  );
};

export default WorkflowNode;