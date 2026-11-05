import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiUser, FiMail, FiLock, FiSun, FiMoon } from 'react-icons/fi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import SplineRobot from '../../components/common/SplineRobot';
import PlacementIQLogo from '../../components/common/PlacementIQLogo';

const Register = () => {
  const { register: registerAuth } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setErrorMsg('');
    setLoading(true);
    try {
      await registerAuth(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-dark-900 dark:text-white flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 relative overflow-hidden transition-colors duration-300">
      {/* Floating Theme Toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-30 p-2.5 rounded-xl border border-dark-200 dark:border-[rgba(88,101,242,0.3)] bg-white/80 dark:bg-[#10172A]/80 backdrop-blur-md text-[#5865F2] dark:text-[#00E5FF] hover:bg-white dark:hover:bg-[#17223B] shadow-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all cursor-pointer"
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme"
      >
        {isDark ? <FiSun className="h-5 w-5 text-[#00E5FF]" /> : <FiMoon className="h-5 w-5 text-[#5865F2]" />}
      </button>

      {/* Main Two-Column Container: Card + Spline 3D Robot */}
      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 relative z-10 my-auto py-8">
        {/* Left Column: Premium Glowing Glassmorphic Signup Card */}
        <div className="w-full max-w-md">
          {/* Logo Banner */}
          <div className="flex flex-col items-center space-y-2 mb-6">
            <PlacementIQLogo size={48} />
            <h2 className="text-2xl sm:text-3xl font-black text-dark-900 dark:text-white tracking-tight text-center">
              Create an account on <span className="bg-gradient-to-r from-[#5865F2] via-[#A855F7] to-[#00E5FF] bg-clip-text text-transparent">PlacementIQ</span>
            </h2>
            <p className="text-sm font-medium text-dark-500 dark:text-[#94A3B8] text-center">
              Start predicting and optimizing your placement readiness
            </p>
          </div>

          {/* Glowing Glass Card */}
          <div className="relative rounded-3xl border border-primary-200/80 dark:border-[rgba(88,101,242,0.3)] bg-white/90 dark:bg-[#10172A]/85 backdrop-blur-2xl p-7 sm:p-9 shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(88,101,242,0.2),0_0_15px_rgba(0,229,255,0.15)] overflow-hidden transition-all duration-300 hover:border-[#00E5FF]/40">
            {/* Top Gradient Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5865F2] via-[#A855F7] to-[#00E5FF]" />

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                icon={FiUser}
                error={errors.name}
                {...register('name', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={FiMail}
                error={errors.email}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={FiLock}
                error={errors.password}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                icon={FiLock}
                error={errors.confirmPassword}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === passwordVal || 'Passwords do not match',
                })}
              />

              <Button
                type="submit"
                className="w-full mt-3"
                loading={loading}
              >
                Sign Up
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-dark-500 dark:text-[#94A3B8]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-[#5865F2] dark:text-[#00E5FF] hover:underline transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Spline 3D Robot Floating Interactively */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative min-h-[480px] lg:min-h-[580px]">
          <SplineRobot
            height="560px"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
