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

  const motionProps = onClick
    ? {
        whileHover: hoverEffect
          ? {
              y: -4,
              boxShadow:
                '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 229, 255, 0.25)',
            }
          : {},
        whileTap: { scale: 0.985 },
        onClick,
      }
    : {};

  return (
    <CardComponent
      className={`rounded-2xl border border-dark-200/80 dark:border-[rgba(88,101,242,0.22)] bg-white/85 dark:bg-[#10172A]/75 backdrop-blur-xl p-6 shadow-xs dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6),0_0_20px_rgba(88,101,242,0.1)] transition-all duration-300 relative ${
        hoverEffect && !onClick
          ? 'hover:shadow-md dark:hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7),0_0_30px_rgba(0,229,255,0.22),0_0_15px_rgba(168,85,247,0.18)] dark:hover:border-[rgba(0,229,255,0.4)] dark:hover:translate-y-[-2px]'
          : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;
