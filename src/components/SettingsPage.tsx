import React, { useState } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import ProfileSettings from './settings/ProfileSettings';
import AccountsSettings from './settings/AccountsSettings';
import CategoriesSettings from './settings/CategoriesSettings';
import GoalsSettings from './settings/GoalsSettings';
import NotificationsSettings from './settings/NotificationsSettings';
import { LoanSettingsProvider } from '../features/loans/SettingsProvider';
import { LoanList } from '../features/loans/components/LoanList';
import SecuritySettings from './settings/SecuritySettings';
import PreferencesSettings from './settings/PreferencesSettings';
import DataSettings from './settings/DataSettings';

const settingsSections = [
  { id: 'profile', name: 'Profile', icon: '👤' },
  { id: 'accounts', name: 'Accounts', icon: '🏦' },
  { id: 'loans', name: 'Loans', icon: '💳' },
  { id: 'categories', name: 'Categories', icon: '📊' },
  { id: 'goals', name: 'Goals', icon: '🎯' },
  { id: 'notifications', name: 'Notifications', icon: '🔔' },
  { id: 'security', name: 'Security', icon: '🔒' },
  { id: 'preferences', name: 'Preferences', icon: '⚙️' },
  { id: 'data', name: 'Data & Export', icon: '📁' },
];

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setHasUnsavedChanges(false);
    setSaving(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <ProfileSettings onChanged={() => setHasUnsavedChanges(true)} />;
      case 'accounts': return <AccountsSettings onChanged={() => setHasUnsavedChanges(true)} />;
      case 'loans':
        return (
          <LoanSettingsProvider>
            <LoanList />
          </LoanSettingsProvider>
        );
      case 'categories': return <CategoriesSettings onChanged={() => setHasUnsavedChanges(true)} />;
      case 'goals': return <GoalsSettings onChanged={() => setHasUnsavedChanges(true)} />;
      case 'notifications': return <NotificationsSettings onChanged={() => setHasUnsavedChanges(true)} />;
      case 'security': return <SecuritySettings onChanged={() => setHasUnsavedChanges(true)} />;
      case 'preferences': return <PreferencesSettings onChanged={() => setHasUnsavedChanges(true)} />;
      case 'data': return <DataSettings onChanged={() => setHasUnsavedChanges(true)} />;
      default: return <ProfileSettings onChanged={() => setHasUnsavedChanges(true)} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account, preferences, and financial setup</p>
        </div>
        
        {hasUnsavedChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Settings</h3>
            </div>
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span>{section.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
