import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) => {
  const CardComponent = onClick ? motion.div : 'div';
  
  const motionProps = onClick ? {
    whileHover: hoverEffect ? { y: -4, boxShadow: '0 12px 20px -10px rgba(0,0,0,0.15)' } : {},
    whileTap: { scale: 0.98 },
    onClick
  } : {};

  return (
    <CardComponent
      className={`rounded-xl border border-dark-200/80 dark:border-dark-800/80 bg-white/85 dark:bg-dark-900/70 backdrop-blur-md p-6 shadow-xs dark:shadow-none transition-all duration-300 ${
        hoverEffect && !onClick ? 'hover:shadow-md hover:border-dark-300 dark:hover:border-dark-700' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;
