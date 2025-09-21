import React, { useState } from 'react';
import { Bell, Mail, Smartphone, AlertTriangle } from 'lucide-react';

interface NotificationsSettingsProps {
  onChanged: () => void;
}

const NotificationsSettings: React.FC<NotificationsSettingsProps> = ({ onChanged }) => {
  const [notifications, setNotifications] = useState({
    email: {
      enabled: true,
      billReminders: true,
      goalMilestones: true,
      budgetAlerts: true,
      weeklyReports: false,
      monthlyReports: true
    },
    push: {
      enabled: true,
      billReminders: true,
      budgetAlerts: true,
      goalMilestones: true,
      lowBalance: true,
      overduePayments: true
    },
    frequency: {
      billReminderDays: 3,
      budgetAlertThreshold: 80,
      lowBalanceThreshold: 1000
    }
  });

  const handleToggle = (category: 'email' | 'push', setting: string) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
    onChanged();
  };

  const handleFrequencyChange = (setting: string, value: number) => {
    setNotifications(prev => ({
      ...prev,
      frequency: {
        ...prev.frequency,
        [setting]: value
      }
    }));
    onChanged();
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Email Notifications</h2>
            <p className="text-sm text-gray-600">Receive updates via email</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Enable Email Notifications</h4>
              <p className="text-sm text-gray-600">Master switch for all email alerts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email.enabled}
                onChange={() => handleToggle('email', 'enabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {notifications.email.enabled && (
            <div className="space-y-3 ml-4 border-l-2 border-blue-200 pl-4">
              {[
                { key: 'billReminders', label: 'Bill Reminders', desc: 'Get notified before bills are due' },
                { key: 'goalMilestones', label: 'Goal Milestones', desc: 'Celebrate when you hit savings targets' },
                { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Warning when approaching budget limits' },
                { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Summary of your financial week' },
                { key: 'monthlyReports', label: 'Monthly Reports', desc: 'Comprehensive monthly analysis' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">{item.label}</h5>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email[item.key]}
                      onChange={() => handleToggle('email', item.key)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Smartphone className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Push Notifications</h2>
            <p className="text-sm text-gray-600">Instant alerts on your device</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Enable Push Notifications</h4>
              <p className="text-sm text-gray-600">Real-time alerts for important events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push.enabled}
                onChange={() => handleToggle('push', 'enabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          {notifications.push.enabled && (
            <div className="space-y-3 ml-4 border-l-2 border-green-200 pl-4">
              {[
                { key: 'billReminders', label: 'Bill Reminders', desc: 'Upcoming payment notifications' },
                { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'When you exceed spending limits' },
                { key: 'goalMilestones', label: 'Goal Milestones', desc: 'Achievement celebrations' },
                { key: 'lowBalance', label: 'Low Balance', desc: 'When account balance is low' },
                { key: 'overduePayments', label: 'Overdue Payments', desc: 'Critical payment reminders' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">{item.label}</h5>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push[item.key]}
                      onChange={() => handleToggle('push', item.key)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notification Timing */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Alert Thresholds</h2>
            <p className="text-sm text-gray-600">Customize when you receive alerts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bill Reminder (days before due)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={notifications.frequency.billReminderDays}
              onChange={(e) => handleFrequencyChange('billReminderDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Alert (% of budget used)
            </label>
            <input
              type="number"
              min="50"
              max="100"
              value={notifications.frequency.budgetAlertThreshold}
              onChange={(e) => handleFrequencyChange('budgetAlertThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Low Balance Alert (NOK)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={notifications.frequency.lowBalanceThreshold}
              onChange={(e) => handleFrequencyChange('lowBalanceThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSettings;