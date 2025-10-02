import React, { useState } from 'react';
import { User, Mail, Globe, Calendar } from 'lucide-react';

interface ProfileSettingsProps {
  onChanged: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onChanged }) => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    currency: 'NOK',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Europe/Oslo',
    monthlyIncome: 52000,
    paycheckFrequency: 'monthly',
    nextPaycheckDate: '2024-01-31'
  });

  const handleChange = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    onChanged();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Currency</label>
            <select
              value={profile.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="NOK">NOK - Norwegian Krone</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="SEK">SEK - Swedish Krona</option>
              <option value="DKK">DKK - Danish Krone</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select
              value={profile.dateFormat}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (European)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </select>
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Financial Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">NOK</span>
              <input
                type="number"
                value={profile.monthlyIncome}
                onChange={(e) => handleChange('monthlyIncome', parseInt(e.target.value))}
                className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paycheck Frequency</label>
            <select
              value={profile.paycheckFrequency}
              onChange={(e) => handleChange('paycheckFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Next Paycheck Date</label>
            <input
              type="date"
              value={profile.nextPaycheckDate}
              onChange={(e) => handleChange('nextPaycheckDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={profile.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Europe/Oslo">Europe/Oslo (Norway)</option>
              <option value="Europe/Stockholm">Europe/Stockholm (Sweden)</option>
              <option value="Europe/Copenhagen">Europe/Copenhagen (Denmark)</option>
              <option value="Europe/London">Europe/London (UK)</option>
              <option value="America/New_York">America/New_York (US East)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (US West)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Profile Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-700 font-medium">Income:</span>
            <span className="ml-2 text-blue-900">NOK {profile.monthlyIncome.toLocaleString()}/month</span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Currency:</span>
            <span className="ml-2 text-blue-900">{profile.currency}</span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Frequency:</span>
            <span className="ml-2 text-blue-900 capitalize">{profile.paycheckFrequency}</span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Next Pay:</span>
            <span className="ml-2 text-blue-900">{new Date(profile.nextPaycheckDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;