import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import SparklesBackground from './components/common/SparklesBackground';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Result from './pages/Result';
import Analytics from './pages/Analytics';
import Roadmap from './pages/Roadmap';
import History from './pages/History';
import Companies from './pages/Companies';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Mentor from './pages/Mentor';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <SparklesBackground />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Dashboard) */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/prediction/result" element={<Result />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/mentor" element={<Mentor />} />
              <Route path="/history" element={<History />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Admin Panel (Will add validation inside component later) */}
              <Route path="/admin" element={<Admin />} />
            </Route>

            {/* Catch-All / 404 */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
