import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Settings, MapPin, Package, Star, Wallet, Gift } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('basic-info');

  const tabs = [
    { id: 'basic-info', label: 'Basic Info', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'bookings', label: 'My Bookings', icon: Package },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'payments', label: 'Payments', icon: Wallet },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.fullName}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-8 mt-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              {activeTab === 'basic-info' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                  {/* Add form fields for basic info */}
                </div>
              )}
              {/* Add other tab content */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}