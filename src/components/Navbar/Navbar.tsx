import React from 'react';
import { Sun, Moon, Home, PenTool as Tool, Clock, LogIn, UserPlus, Bell, LogOut, BookOpen, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';
import { Notification } from '../Notification/Notification';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { notification, clearNotification } = useNotification();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Home className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-orange-500">HOME REPAIR</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-orange-500">Home</Link>
            <Link to="/services" className="text-gray-700 dark:text-gray-200 hover:text-orange-500">Services</Link>
            <Link to="/help" className="text-gray-700 dark:text-gray-200 hover:text-orange-500">Help & Support</Link>
            {user && (
              <>
                <Link to="/my-bookings" className="text-gray-700 dark:text-gray-200 hover:text-orange-500">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-5 h-5" />
                    <span>My Bookings</span>
                  </div>
                </Link>
                <Link to="/profile" className="text-gray-700 dark:text-gray-200 hover:text-orange-500">
                  <div className="flex items-center gap-1">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </div>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-700 dark:text-gray-200">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-orange-500"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-orange-500">
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-orange-500">
                  <UserPlus className="w-5 h-5" />
                  <span>Register</span>
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            {notification && (
              <Notification 
                message={notification} 
                onClose={clearNotification} 
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}