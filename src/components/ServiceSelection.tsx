import React from 'react';
import { MapPin, PenTool } from 'lucide-react';

export function ServiceSelection() {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <PenTool className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Service</h2>
      </div>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Location
          </label>
          <div className="mt-1 relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your location"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Service Type
          </label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Cleaning</option>
            <option>Painting</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
        >
          Find Service
        </button>
      </form>
    </div>
  );
}