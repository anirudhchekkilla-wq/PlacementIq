import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PlacementIQLogo from './PlacementIQLogo';
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
  FiFileText,
} from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: FiGrid },
    { name: 'Predict Placement', to: '/prediction', icon: FiCpu },
    { name: 'Analytics', to: '/analytics', icon: FiBarChart2 },
    { name: 'My Roadmap', to: '/roadmap', icon: FiMap },
    { name: 'AI Career Mentor', to: '/mentor', icon: FiMessageSquare },
    { name: 'AI Resume Analyser', to: '/resume-analyser', icon: FiFileText },
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
      className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-dark-200 dark:border-[rgba(88,101,242,0.2)] bg-white/85 dark:bg-[#10172A]/85 backdrop-blur-2xl transition-transform md:translate-x-0 flex flex-col justify-between ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6">
        {/* Logo */}
        <div className="flex items-center space-x-2.5 px-2 mb-8">
          <PlacementIQLogo size={36} />
          <div>
            <h1 className="text-md font-extrabold text-dark-900 dark:text-white tracking-tight leading-none">
              Placement<span className="text-[#00E5FF]">IQ</span>
            </h1>
            <span className="text-[10px] text-dark-400 dark:text-[#94A3B8] uppercase tracking-widest font-bold">
              AI Intelligence Engine
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-6 flex-1">
          <div>
            <span className="text-[10px] font-bold text-dark-400 dark:text-[#94A3B8] uppercase tracking-widest px-2.5 block mb-3">
              Core Platform
            </span>
            <nav className="space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={() => window.innerWidth < 768 && toggleSidebar()}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-gradient-to-r dark:from-[rgba(88,101,242,0.25)] dark:to-[rgba(0,229,255,0.15)] dark:text-[#00E5FF] dark:border dark:border-[rgba(0,229,255,0.35)] dark:shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                        : 'text-dark-600 dark:text-[#94A3B8] hover:bg-dark-50 dark:hover:bg-[#17223B]/60 hover:text-dark-900 dark:hover:text-white'
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
              <span className="text-[10px] font-bold text-dark-400 dark:text-[#94A3B8] uppercase tracking-widest px-2.5 block mb-3">
                Management
              </span>
              <nav className="space-y-1">
                {adminNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    onClick={() => window.innerWidth < 768 && toggleSidebar()}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-primary-50 text-primary-600 dark:bg-gradient-to-r dark:from-[rgba(88,101,242,0.25)] dark:to-[rgba(0,229,255,0.15)] dark:text-[#00E5FF] dark:border dark:border-[rgba(0,229,255,0.35)] dark:shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                          : 'text-dark-600 dark:text-[#94A3B8] hover:bg-dark-50 dark:hover:bg-[#17223B]/60 hover:text-dark-900 dark:hover:text-white'
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
      <div className="p-4 border-t border-dark-200 dark:border-[rgba(88,101,242,0.2)] space-y-3 bg-dark-50/50 dark:bg-[#080B16]/50">
        {/* User Card */}
        {user && (
          <div className="flex items-center space-x-3 px-1.5 py-1">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#5865F2] to-[#00E5FF] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(0,229,255,0.3)]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-dark-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-dark-400 dark:text-[#00E5FF] truncate capitalize font-medium">
                {user.role} Account
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-xl border border-dark-200 dark:border-[rgba(88,101,242,0.25)] text-dark-500 dark:text-[#00E5FF] hover:bg-white dark:hover:bg-[#17223B] transition-smooth cursor-pointer flex-1"
          >
            {isDark ? <FiSun className="h-4.5 w-4.5 text-[#00E5FF]" /> : <FiMoon className="h-4.5 w-4.5 text-[#5865F2]" />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center justify-center p-2 rounded-xl border border-dark-200 dark:border-[rgba(239,68,68,0.3)] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-smooth cursor-pointer flex-1"
          >
            <FiLogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
