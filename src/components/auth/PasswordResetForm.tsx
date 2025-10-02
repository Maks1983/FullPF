import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertTriangle, Loader2, Key } from 'lucide-react';

interface PasswordResetFormProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'demo-instance'
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message);
        setStep('confirm');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'demo-instance'
        },
        body: JSON.stringify({ 
          token: resetToken, 
          newPassword 
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      } else {
        setError(result.message);
        if (result.errors) {
          setError(result.errors.join(', '));
        }
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'request') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleRequestReset} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm">
          <Key className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          Set new password
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your new password and reset token
        </p>
      </div>

      <form onSubmit={handleConfirmReset} className="space-y-4">
        <div>
          <label htmlFor="resetToken" className="block text-sm font-medium text-gray-700 mb-2">
            Reset Token
          </label>
          <input
            id="resetToken"
            type="text"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            placeholder="Enter the token from your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono"
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Enter your new password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
            minLength={8}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Confirm your new password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
            minLength={8}
          />
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || newPassword !== confirmPassword}
          className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Key className="h-4 w-4 mr-2" />
          )}
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </button>
      </form>

      {/* Password Requirements */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Password Requirements</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• At least 8 characters long</li>
          <li>• Contains uppercase and lowercase letters</li>
          <li>• Contains at least one number</li>
          <li>• Contains at least one special character</li>
          <li>• Avoid common patterns (123456, password, etc.)</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordResetForm;