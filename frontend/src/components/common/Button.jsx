import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#5865F2] via-[#7C3AED] to-[#00E5FF] text-white font-bold shadow-[0_0_20px_rgba(88,101,242,0.4),0_0_30px_rgba(0,229,255,0.2)] hover:shadow-[0_0_28px_rgba(88,101,242,0.65),0_0_40px_rgba(0,229,255,0.45)] hover:brightness-110 border-0',
    secondary:
      'bg-dark-100 hover:bg-dark-200 text-dark-800 dark:bg-[#10172A]/80 dark:hover:bg-[#17223B] dark:text-[#00E5FF] dark:border dark:border-[rgba(0,229,255,0.3)] dark:shadow-[0_0_15px_rgba(0,229,255,0.15)] dark:hover:shadow-[0_0_25px_rgba(0,229,255,0.35)]',
    outline:
      'bg-transparent hover:bg-dark-100 dark:hover:bg-[#10172A]/80 text-dark-800 dark:text-dark-100 border border-dark-300 dark:border-[rgba(88,101,242,0.35)] dark:hover:border-[#00E5FF] dark:hover:text-[#00E5FF] dark:hover:shadow-[0_0_20px_rgba(0,229,255,0.25)]',
    danger:
      'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] border-0',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-4.5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.025 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
