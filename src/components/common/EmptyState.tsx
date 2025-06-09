import React from 'react';
import { EmptyStateProps } from '../../types';

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  action, 
  icon 
}) => {
  return (
    <div className="text-center py-12 px-4">
      {icon && (
        <div className="mb-4 flex justify-center">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState; 