import React, { useState } from 'react';
import { Palette, Monitor, Globe, Calculator } from 'lucide-react';

interface PreferencesSettingsProps {
  onChanged: () => void;
}

const PreferencesSettings: React.FC<PreferencesSettingsProps> = ({ onChanged }) => {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    compactMode: false,
    showAnimations: true,
    defaultPage: 'dashboard',
    chartType: 'line',
    numberFormat: 'standard',
    showCents: false,
    autoRefresh: true,
    refreshInterval: 300,
    language: 'en',
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false
    }
  });

  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPreferences(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPreferences(prev => ({ ...prev, [field]: value }));
    }
    onChanged();
  };

  return (
    <div className="space-y-6">
      {/* Appearance Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Palette className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Appearance & Display</h2>
            <p className="text-sm text-gray-600">Customize how your dashboard looks and feels</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select
                value={preferences.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Page</label>
              <select
                value={preferences.defaultPage}
                onChange={(e) => handleChange('defaultPage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="dashboard">Dashboard</option>
                <option value="current">Current</option>
                <option value="savings">Savings</option>
                <option value="debts">Debts</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Style</label>
              <select
                value={preferences.chartType}
                onChange={(e) => handleChange('chartType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="line">Line Charts</option>
                <option value="bar">Bar Charts</option>
                <option value="area">Area Charts</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Compact Mode</h4>
                <p className="text-sm text-gray-600">Show more data in less space</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.compactMode}
                  onChange={(e) => handleChange('compactMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Show Animations</h4>
                <p className="text-sm text-gray-600">Enable smooth transitions and effects</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.showAnimations}
                  onChange={(e) => handleChange('showAnimations', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Show Cents</h4>
                <p className="text-sm text-gray-600">Display decimal places in amounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.showCents}
                  onChange={(e) => handleChange('showCents', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Data Refresh Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Monitor className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Data & Refresh</h2>
            <p className="text-sm text-gray-600">Control how often data updates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900">Auto Refresh</h4>
                <p className="text-sm text-gray-600">Automatically update data in background</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.autoRefresh}
                  onChange={(e) => handleChange('autoRefresh', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {preferences.autoRefresh && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refresh Interval (seconds)
                </label>
                <select
                  value={preferences.refreshInterval}
                  onChange={(e) => handleChange('refreshInterval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                  <option value={600}>10 minutes</option>
                  <option value={1800}>30 minutes</option>
                  <option value={3600}>1 hour</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number Format</label>
              <select
                value={preferences.numberFormat}
                onChange={(e) => handleChange('numberFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="standard">Standard (1,234)</option>
                <option value="compact">Compact (1.2K)</option>
                <option value="scientific">Scientific (1.23E+3)</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="no">Norwegian (Norsk)</option>
                <option value="sv">Swedish (Svenska)</option>
                <option value="da">Danish (Dansk)</option>
                <option value="de">German (Deutsch)</option>
                <option value="fr">French (Français)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Globe className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Accessibility</h2>
            <p className="text-sm text-gray-600">Make the app work better for you</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">High Contrast Mode</h4>
              <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.accessibility.highContrast}
                onChange={(e) => handleChange('accessibility.highContrast', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Reduced Motion</h4>
              <p className="text-sm text-gray-600">Minimize animations and transitions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.accessibility.reducedMotion}
                onChange={(e) => handleChange('accessibility.reducedMotion', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Large Text</h4>
              <p className="text-sm text-gray-600">Increase font sizes for better readability</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.accessibility.largeText}
                onChange={(e) => handleChange('accessibility.largeText', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Dashboard Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Calculator className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Dashboard Preferences</h2>
            <p className="text-sm text-gray-600">Customize your dashboard experience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Default Timeframe</label>
              <div className="grid grid-cols-2 gap-2">
                {['1M', '3M', '6M', '1Y'].map((period) => (
                  <button
                    key={period}
                    onClick={() => handleChange('defaultTimeframe', period)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      preferences.defaultTimeframe === period
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Quick Actions</label>
              <div className="space-y-2">
                {[
                  { key: 'showQuickAdd', label: 'Show Quick Add buttons' },
                  { key: 'showGoalProgress', label: 'Show goal progress in header' },
                  { key: 'showHealthScore', label: 'Show financial health score' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences[item.key] !== false}
                        onChange={(e) => handleChange(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Widget Visibility</label>
              <div className="space-y-2">
                {[
                  { key: 'showCashflowChart', label: 'Cashflow projection chart' },
                  { key: 'showSpendingCategories', label: 'Spending categories' },
                  { key: 'showUpcomingPayments', label: 'Upcoming payments timeline' },
                  { key: 'showRecentTransactions', label: 'Recent transactions' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences[item.key] !== false}
                        onChange={(e) => handleChange(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Sample Dashboard Card</h4>
            <div className={`px-2 py-1 text-xs rounded-full ${
              preferences.theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
            }`}>
              {preferences.theme} theme
            </div>
          </div>
          <div className={`text-2xl font-bold mb-1 ${
            preferences.accessibility.largeText ? 'text-3xl' : 'text-2xl'
          }`}>
            NOK {preferences.showCents ? '15,420.50' : '15,420'}
          </div>
          <p className={`text-gray-600 ${
            preferences.accessibility.largeText ? 'text-base' : 'text-sm'
          }`}>
            Available Balance
          </p>
          {preferences.showAnimations && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreferencesSettings;