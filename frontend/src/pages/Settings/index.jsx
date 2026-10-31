import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiCheckCircle, FiLock, FiSun, FiMoon } from 'react-icons/fi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Settings = () => {
  const { updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const passwordVal = watch('newPassword');

  const onSubmit = async (data) => {
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);
    try {
      await updateProfile({
        password: data.newPassword,
      });
      setSuccessMsg('Account password successfully updated.');
      reset();
    } catch (err) {
      setErrorMsg(err || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-dark-900 dark:text-white">
          Account Settings
        </h2>
        <p className="text-sm text-dark-500 dark:text-dark-400">
          Customize your experience and manage login security details.
        </p>
      </div>

      {successMsg && (
        <Card className="border-green-200 bg-green-50/20 dark:border-green-950/20 dark:bg-green-950/10 flex items-center space-x-2.5 p-4 rounded-xl">
          <FiCheckCircle className="text-green-500" size={20} />
          <span className="text-xs md:text-sm text-green-700 dark:text-green-400 font-semibold">
            {successMsg}
          </span>
        </Card>
      )}

      {errorMsg && (
        <Card className="border-red-200 bg-red-50/20 dark:border-red-900/50 dark:bg-red-950/10 flex items-center space-x-2.5 p-4 rounded-xl">
          <span className="text-xs md:text-sm text-red-700 dark:text-red-400 font-semibold">
            {errorMsg}
          </span>
        </Card>
      )}

      {/* Theme Card */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-dark-800 dark:text-white uppercase tracking-wider">
          Appearance Mode
        </h3>
        <p className="text-xs text-dark-500">
          Switch between dark and light themes for visual comfort.
        </p>
        <div className="flex items-center justify-between p-3 bg-dark-50 dark:bg-dark-900 rounded-lg border border-dark-100 dark:border-dark-800/40">
          <span className="text-xs font-semibold text-dark-800 dark:text-white">
            Current Theme: <strong className="capitalize">{theme}</strong>
          </span>
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            {theme === 'light' ? (
              <>
                <FiMoon className="mr-1.5" /> Dark Mode
              </>
            ) : (
              <>
                <FiSun className="mr-1.5" /> Light Mode
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Password Reset Card */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-dark-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <FiLock /> Change Password
        </h3>
        <p className="text-xs text-dark-500">
          Ensure your account stays secure by choosing a strong password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.newPassword}
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword}
            {...register('confirmPassword', {
              required: 'Please confirm password',
              validate: (val) => val === passwordVal || 'Passwords do not match',
            })}
          />

          <div className="pt-2 flex justify-end">
            <Button type="submit" loading={loading}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Settings;
