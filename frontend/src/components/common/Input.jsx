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
      <div className="relative rounded-xl shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5865F2] dark:text-[#00E5FF] transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={`block w-full rounded-xl border transition-all duration-300 text-sm focus:outline-none bg-white/90 dark:bg-[#080B16]/75 text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-500 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } py-2.5 ${
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
              : 'border-primary-200/80 dark:border-[rgba(88,101,242,0.3)] hover:border-primary-400 dark:hover:border-[#5865F2] focus:border-[#00E5FF] dark:focus:border-[#00E5FF] focus:shadow-[0_0_18px_rgba(0,229,255,0.35),0_0_28px_rgba(88,101,242,0.2)]'
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
