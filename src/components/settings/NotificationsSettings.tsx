import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Clock, DollarSign, AlertTriangle, TrendingUp, Target } from 'lucide-react';

interface NotificationsSettingsProps {
  onChanged: () => void;
}

export default function NotificationsSettings({ onChanged }: NotificationsSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [goalMilestones, setGoalMilestones] = useState(true);
  const [billReminders, setBillReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [budgetThreshold, setBudgetThreshold] = useState(80);
  const [reminderDays, setReminderDays] = useState(3);

  const handleChange = (setter: (value: any) => void, value: any) => {
    setter(value);
    onChanged();
  };

  return (
    <div className="space-y-8">
      {/* Notification Channels */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-blue-600" />
          Notification Channels
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => handleChange(setEmailNotifications, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Smartphone className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications on your device</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => handleChange(setPushNotifications, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Alert Types */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
          Alert Types
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Budget Alerts</p>
                <p className="text-sm text-gray-600">When you approach spending limits</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={budgetAlerts}
                onChange={(e) => handleChange(setBudgetAlerts, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Target className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Goal Milestones</p>
                <p className="text-sm text-gray-600">When you reach savings milestones</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={goalMilestones}
                onChange={(e) => handleChange(setGoalMilestones, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Bill Reminders</p>
                <p className="text-sm text-gray-600">Upcoming payment notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={billReminders}
                onChange={(e) => handleChange(setBillReminders, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Alert Threshold
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="50"
                max="100"
                value={budgetThreshold}
                onChange={(e) => handleChange(setBudgetThreshold, parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                {budgetThreshold}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Get notified when you've spent this percentage of your budget
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bill Reminder Days
            </label>
            <select
              value={reminderDays}
              onChange={(e) => handleChange(setReminderDays, parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>1 day before</option>
              <option value={2}>2 days before</option>
              <option value={3}>3 days before</option>
              <option value={5}>5 days before</option>
              <option value={7}>1 week before</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports & Updates */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Reports & Updates
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Weekly Financial Reports</p>
              <p className="text-sm text-gray-600">Summary of your financial activity</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={weeklyReports}
                onChange={(e) => handleChange(setWeeklyReports, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Product Updates & Tips</p>
              <p className="text-sm text-gray-600">New features and financial tips</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={marketingEmails}
                onChange={(e) => handleChange(setMarketingEmails, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}