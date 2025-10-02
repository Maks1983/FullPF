import React, { useState } from 'react';
import { LogIn, Lock, Eye, EyeOff, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onForgotPassword }) => {
  const { login, completeTwoFactor } = useAuthContext();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [twoFactorChallenge, setTwoFactorChallenge] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');

  const handleInputChange = (field: 'username' | 'password') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
    setTwoFactorError('');
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setTwoFactorError('');

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.status === 'challenge') {
        setTwoFactorChallenge(result.challengeId);
        setTwoFactorCode('');
      } else if (result.status === 'success') {
        setFormData({ username: '', password: '' });
        onSuccess?.();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!twoFactorChallenge) return;

    setLoading(true);
    setTwoFactorError('');

    try {
      const result = await completeTwoFactor(twoFactorChallenge, twoFactorCode);
      
      if (result.status === 'success') {
        setTwoFactorChallenge(null);
        setTwoFactorCode('');
        setFormData({ username: '', password: '' });
        onSuccess?.();
      } else {
        setTwoFactorError(result.error);
      }
    } catch (err) {
      setTwoFactorError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (twoFactorChallenge) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-sm">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code from your authenticator app
          </p>
          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Demo Code:</strong> 246810
            </p>
          </div>
        </div>

        <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
          <div>
            <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700 mb-2">
              Authentication Code
            </label>
            <input
              id="twoFactorCode"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center text-lg font-mono"
              required
            />
          </div>

          {twoFactorError && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{twoFactorError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || twoFactorCode.length !== 6}
            className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Lock className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>

          <button
            type="button"
            onClick={() => {
              setTwoFactorChallenge(null);
              setTwoFactorCode('');
              setTwoFactorError('');
            }}
            className="w-full text-sm text-gray-600 hover:text-gray-800"
          >
            Back to Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-sm">
          <LogIn className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Access your personal finance dashboard
        </p>
      </div>

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange('username')}
            autoComplete="username"
            placeholder="Enter your username"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <LogIn className="h-4 w-4 mr-2" />
          )}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
          >
            Forgot your password?
          </button>
        </div>
      </form>

      {/* Demo Credentials */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials</h4>
        <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Owner:</span>
            <span className="font-mono">admin / admin</span>
          </div>
          <div className="flex justify-between">
            <span>Manager:</span>
            <span className="font-mono">manager / manager</span>
          </div>
          <div className="flex justify-between">
            <span>User:</span>
            <span className="font-mono">demo / demo</span>
          </div>
          <div className="flex justify-between">
            <span>Premium:</span>
            <span className="font-mono">premium / premium</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;