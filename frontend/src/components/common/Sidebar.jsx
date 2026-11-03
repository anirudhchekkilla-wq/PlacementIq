import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FiGrid,
  FiCpu,
  FiBarChart2,
  FiMap,
  FiClock,
  FiBriefcase,
  FiUser,
  FiSettings,
  FiShield,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMessageSquare,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: FiGrid },
    { name: 'Predict Placement', to: '/prediction', icon: FiCpu },
    { name: 'Analytics', to: '/analytics', icon: FiBarChart2 },
    { name: 'My Roadmap', to: '/roadmap', icon: FiMap },
    { name: 'AI Career Mentor', to: '/mentor', icon: FiMessageSquare },
    { name: 'History', to: '/history', icon: FiClock },
    { name: 'Companies', to: '/companies', icon: FiBriefcase },
    { name: 'My Profile', to: '/profile', icon: FiUser },
    { name: 'Settings', to: '/settings', icon: FiSettings },
  ];

  const adminNavigation = [
    { name: 'Admin Portal', to: '/admin', icon: FiShield },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-dark-200 dark:border-dark-800 bg-white/80 dark:bg-dark-950/80 backdrop-blur-lg transition-transform md:translate-x-0 flex flex-col justify-between ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6">
        {/* Logo */}
        <div className="flex items-center space-x-2.5 px-2 mb-8">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20 text-lg">
            P
          </div>
          <div>
            <h1 className="text-md font-bold text-dark-900 dark:text-white tracking-tight leading-none">
              PlacementIQ
            </h1>
            <span className="text-[10px] text-dark-400 dark:text-dark-500 uppercase tracking-widest font-bold">
              Predictor & Advisor
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-6 flex-1">
          <div>
            <span className="text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-widest px-2.5 block mb-3">
              Core Platform
            </span>
            <nav className="space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={() => window.innerWidth < 768 && toggleSidebar()}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400'
                        : 'text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-900/50 hover:text-dark-900 dark:hover:text-white'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {isAdmin && (
            <div>
              <span className="text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-widest px-2.5 block mb-3">
                Management
              </span>
              <nav className="space-y-1">
                {adminNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    onClick={() => window.innerWidth < 768 && toggleSidebar()}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth ${
                        isActive
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400'
                          : 'text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-900/50 hover:text-dark-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-dark-200 dark:border-dark-800 space-y-3 bg-dark-50/50 dark:bg-dark-950/30">
        {/* User Card */}
        {user && (
          <div className="flex items-center space-x-3 px-1.5 py-1">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-dark-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-dark-400 dark:text-dark-500 truncate capitalize">
                {user.role} Account
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-lg border border-dark-200 dark:border-dark-800 text-dark-500 dark:text-dark-400 hover:bg-white dark:hover:bg-dark-900 transition-smooth cursor-pointer flex-1"
          >
            {isDark ? <FiSun className="h-4.5 w-4.5" /> : <FiMoon className="h-4.5 w-4.5" />}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center justify-center p-2 rounded-lg border border-dark-200 dark:border-dark-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-smooth cursor-pointer flex-1"
          >
            <FiLogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
