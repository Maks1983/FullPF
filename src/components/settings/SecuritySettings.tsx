import React, { useState } from 'react';
import { Shield, Key, Smartphone, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface SecuritySettingsProps {
  onChanged: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onChanged }) => {
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    biometricEnabled: true,
    sessionTimeout: 30,
    loginNotifications: true,
    dataEncryption: true,
    autoLogout: true
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSecurityToggle = (setting: string) => {
    setSecurity(prev => ({ ...prev, [setting]: !prev[setting] }));
    onChanged();
  };

  const handleSessionTimeoutChange = (minutes: number) => {
    setSecurity(prev => ({ ...prev, sessionTimeout: minutes }));
    onChanged();
  };

  return (
    <div className="space-y-6">
      {/* Password Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <Key className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Password & Authentication</h2>
            <p className="text-sm text-gray-600">Manage your login credentials</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Change Password</h4>
              <p className="text-sm text-gray-600">Last changed 45 days ago</p>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showPasswordForm && (
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <div className="flex items-center space-x-3">
              {!security.twoFactorEnabled && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Recommended
                </span>
              )}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.twoFactorEnabled}
                  onChange={() => handleSecurityToggle('twoFactorEnabled')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Biometric Authentication */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Biometric Login</h4>
              <p className="text-sm text-gray-600">Use fingerprint or face recognition</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.biometricEnabled}
                onChange={() => handleSecurityToggle('biometricEnabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Session & Privacy</h2>
            <p className="text-sm text-gray-600">Control your session and data privacy</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-logout after inactivity (minutes)
            </label>
            <select
              value={security.sessionTimeout}
              onChange={(e) => handleSessionTimeoutChange(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={0}>Never</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Login Notifications</h4>
              <p className="text-sm text-gray-600">Get notified of new login attempts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.loginNotifications}
                onChange={() => handleSecurityToggle('loginNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Data Encryption</h4>
              <p className="text-sm text-gray-600">Encrypt sensitive financial data</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Always On
              </span>
              <Shield className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Score</h3>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center bg-white">
            <span className="text-xl font-bold text-green-600">
              {security.twoFactorEnabled && security.biometricEnabled ? '95' : 
               security.twoFactorEnabled || security.biometricEnabled ? '75' : '45'}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {security.twoFactorEnabled && security.biometricEnabled ? 'Excellent Security' :
               security.twoFactorEnabled || security.biometricEnabled ? 'Good Security' : 'Basic Security'}
            </h4>
            <p className="text-sm text-gray-600">
              {security.twoFactorEnabled && security.biometricEnabled 
                ? 'Your account is well protected with multiple security layers'
                : 'Consider enabling 2FA for better protection'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;