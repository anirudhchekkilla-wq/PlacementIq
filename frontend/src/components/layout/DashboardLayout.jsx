import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../common/Sidebar';
import { FiMenu, FiBell, FiChevronDown, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import api from '../../services/api';

const DashboardLayout = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();

  // Redirect if not authenticated
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-50 dark:bg-dark-950">
        <div className="flex flex-col items-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-medium text-dark-500">Loading your profile...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark notifications read:', error);
    }
  };

  // Run on mount
  useEffect(() => {
    // Only fetch if authenticated (which we are)
    fetchNotifications();
  }, [location.pathname]);

  // Page titles map
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard Overview';
    if (path.startsWith('/prediction')) return 'Placement Prediction';
    if (path.startsWith('/analytics')) return 'Analytics Insights';
    if (path.startsWith('/roadmap')) return 'Career Roadmap';
    if (path.startsWith('/history')) return 'Prediction History';
    if (path.startsWith('/companies')) return 'Partner Companies';
    if (path.startsWith('/profile')) return 'Student Profile';
    if (path.startsWith('/settings')) return 'Preferences & Settings';
    if (path.startsWith('/admin')) return 'Administrator Panel';
    return 'PlacementIQ';
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 text-dark-800 dark:text-dark-200">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col flex-1 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-dark-200 dark:border-dark-800 bg-white/70 dark:bg-dark-950/70 backdrop-blur-md px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-900 md:hidden cursor-pointer"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-bold text-dark-900 dark:text-white tracking-tight">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-dark-500 hover:text-dark-900 dark:text-dark-400 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-dark-900 transition-smooth cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="h-5 w-5 text-amber-400" /> : <FiMoon className="h-5 w-5 text-primary-600" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserDropdownOpen(false);
                  if (!notificationsOpen && unreadCount > 0) {
                    markAllAsRead();
                  }
                }}
                className="relative p-2 rounded-lg text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-900 cursor-pointer transition-smooth"
              >
                <FiBell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary-500 animate-ping"></span>
                )}
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary-600"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-dark-100 dark:border-dark-800 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-dark-500">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-dark-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`px-4 py-3 border-b border-dark-50 dark:border-dark-800/40 hover:bg-dark-50 dark:hover:bg-dark-800/30 transition-smooth ${
                            !notification.read ? 'bg-primary-50/20 dark:bg-primary-950/10' : ''
                          }`}
                        >
                          <p className="text-xs font-semibold text-dark-800 dark:text-dark-200">
                            {notification.title}
                          </p>
                          <p className="text-[11px] text-dark-500 dark:text-dark-400 mt-0.5">
                            {notification.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-900 transition-smooth cursor-pointer text-sm"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline-block font-semibold text-xs text-dark-800 dark:text-dark-200">
                  {user.name}
                </span>
                <FiChevronDown className="h-4 w-4 text-dark-400 hidden sm:inline-block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 shadow-lg py-1.5 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-xs text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800/50"
                  >
                    <FiUser className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center space-x-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-left cursor-pointer"
                  >
                    <FiUser className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 bg-dark-50/50 dark:bg-dark-950/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
