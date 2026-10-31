import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <h1 className="text-9xl font-black text-primary-500/25 dark:text-primary-400/25 leading-none">
          404
        </h1>
        <h2 className="text-2xl font-bold text-dark-900 dark:text-white tracking-tight">
          Page Not Found
        </h2>
        <p className="text-dark-500 dark:text-dark-400 text-sm">
          Sorry, we couldn't find the page you are looking for. It might have been moved or deleted.
        </p>
        <div className="pt-4">
          <Link to="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
