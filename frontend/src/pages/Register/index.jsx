import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiUser, FiMail, FiLock, FiSun, FiMoon } from 'react-icons/fi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

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
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Floating Theme Toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-20 p-2.5 rounded-xl border border-primary-200/80 dark:border-dark-700 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md text-primary-600 dark:text-primary-400 hover:bg-white dark:hover:bg-dark-800 shadow-sm hover:shadow transition-all cursor-pointer"
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme"
      >
        {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
      </button>

      {/* Vibrant Ambient Glows */}
      <div className="absolute top-[-15%] left-[-15%] w-[65%] h-[65%] rounded-full bg-gradient-to-br from-primary-400/25 via-indigo-400/20 to-purple-500/15 dark:from-primary-600/30 dark:via-indigo-900/30 dark:to-purple-950/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[65%] h-[65%] rounded-full bg-gradient-to-tl from-indigo-400/20 via-sky-400/15 to-primary-500/15 dark:from-indigo-700/25 dark:via-purple-900/25 dark:to-dark-950/20 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Banner */}
        <div className="flex flex-col items-center space-y-2 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-primary-500/35 ring-4 ring-primary-500/15 text-2xl">
            P
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            Create an account
          </h2>
          <p className="text-sm font-medium text-dark-500 dark:text-dark-300">
            Start predicting and optimizing your placement readiness
          </p>
        </div>

        <div className="relative rounded-2xl border border-primary-200/80 dark:border-primary-500/25 bg-white/90 dark:bg-dark-900/85 backdrop-blur-xl p-8 shadow-2xl shadow-primary-500/10 dark:shadow-primary-950/60 overflow-hidden">
          {/* Top Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-500" />

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold">
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
              className="w-full mt-2 bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 hover:from-primary-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 border-0"
              loading={loading}
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-dark-500 dark:text-dark-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
