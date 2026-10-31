import React from 'react';
import Card from './Card';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend, // { type: 'up' | 'down', value: '12%' }
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <div className="flex justify-between items-start">
          <div className="space-y-3 w-2/3">
            <div className="h-4 bg-dark-200 dark:bg-dark-800 rounded w-1/2" />
            <div className="h-8 bg-dark-300 dark:bg-dark-700 rounded w-full" />
            <div className="h-3 bg-dark-200 dark:bg-dark-800 rounded w-3/4" />
          </div>
          <div className="h-10 w-10 bg-dark-200 dark:bg-dark-800 rounded-lg" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider">
            {title}
          </span>
          <h3 className="text-2xl font-bold text-dark-900 dark:text-white tracking-tight">
            {value}
          </h3>
          {(description || trend) && (
            <div className="flex items-center space-x-1.5 pt-1 text-xs">
              {trend && (
                <span
                  className={`flex items-center font-semibold ${
                    trend.type === 'up'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {trend.type === 'up' ? (
                    <FiTrendingUp className="mr-0.5" />
                  ) : (
                    <FiTrendingDown className="mr-0.5" />
                  )}
                  {trend.value}
                </span>
              )}
              {description && (
                <span className="text-dark-500 dark:text-dark-500">
                  {description}
                </span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-lg">
            <Icon size={20} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
