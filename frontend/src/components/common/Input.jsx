import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  inputClassName = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary-500 dark:text-primary-400 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={`block w-full rounded-lg border transition-smooth text-sm focus:outline-none focus:ring-2 bg-white/90 dark:bg-dark-950/80 text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-500 ${
            Icon ? 'pl-10' : 'pl-3'
          } py-2.5 ${
            error
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
              : 'border-primary-200/80 dark:border-dark-700/80 hover:border-primary-400 dark:hover:border-primary-500/50 focus:ring-primary-500/20 focus:border-primary-600 dark:focus:border-primary-400'
          } ${inputClassName}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-red-500 dark:text-red-400 font-medium">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
