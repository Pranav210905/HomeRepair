import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

export function Notification({ message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 max-w-md border-l-4 border-orange-500 animate-slide-in">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Bell className="h-6 w-6 text-orange-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {message}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Close</span>
          <span className="text-lg">&times;</span>
        </button>
      </div>
    </div>
  );
}