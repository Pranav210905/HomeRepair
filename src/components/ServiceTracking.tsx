import React from 'react';
import { Clock, User } from 'lucide-react';

export function ServiceTracking() {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Track Service</h2>
      </div>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <User className="w-12 h-12 text-orange-500" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">John Smith</h3>
            <p className="text-gray-500 dark:text-gray-400">Service Agent</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">Status</span>
            <span className="text-orange-500 font-medium">In Progress</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">Estimated Time</span>
            <span className="text-gray-900 dark:text-white">45 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
}