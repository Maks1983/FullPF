import React, { useState } from 'react';
import { Download, Upload, Trash2, Database, FileText, Shield } from 'lucide-react';

interface DataSettingsProps {
  onChanged: () => void;
}

const DataSettings: React.FC<DataSettingsProps> = ({ onChanged }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportDateRange, setExportDateRange] = useState('1Y');
  const [includePersonalInfo, setIncludePersonalInfo] = useState(false);

  const handleExport = (type: string) => {
    // Simulate export
    console.log(`Exporting ${type} data...`);
    onChanged();
  };

  const handleImport = () => {
    // Simulate import
    console.log('Importing data...');
    onChanged();
  };

  const handleDeleteData = (type: string) => {
    if (confirm(`Are you sure you want to delete all ${type} data? This action cannot be undone.`)) {
      console.log(`Deleting ${type} data...`);
      onChanged();
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Download className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Export Data</h2>
            <p className="text-sm text-gray-600">Download your financial data for backup or analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="csv">CSV (Spreadsheet)</option>
              <option value="json">JSON (Raw Data)</option>
              <option value="pdf">PDF (Report)</option>
              <option value="xlsx">Excel (XLSX)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={exportDateRange}
              onChange={(e) => setExportDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1M">Last Month</option>
              <option value="3M">Last 3 Months</option>
              <option value="6M">Last 6 Months</option>
              <option value="1Y">Last Year</option>
              <option value="ALL">All Data</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Include Personal Information</h4>
              <p className="text-sm text-gray-600">Include account numbers and personal details</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includePersonalInfo}
                onChange={(e) => setIncludePersonalInfo(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { type: 'transactions', label: 'Transactions', icon: FileText },
            { type: 'accounts', label: 'Accounts', icon: Database },
            { type: 'goals', label: 'Goals', icon: FileText },
            { type: 'complete', label: 'Complete Backup', icon: Database }
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => handleExport(item.type)}
              className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <item.icon className="h-8 w-8 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">{item.label}</span>
              <span className="text-xs text-gray-500 mt-1">Export {item.type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Import */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Import Data</h2>
            <p className="text-sm text-gray-600">Import transactions from bank statements or other apps</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Bank CSV</h4>
            <p className="text-sm text-gray-600 mb-3">Import from bank statement downloads</p>
            <button
              onClick={handleImport}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Choose CSV File
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Other Apps</h4>
            <p className="text-sm text-gray-600 mb-3">Import from Mint, YNAB, etc.</p>
            <button
              onClick={handleImport}
              className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Choose File
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Backup Restore</h4>
            <p className="text-sm text-gray-600 mb-3">Restore from previous backup</p>
            <button
              onClick={handleImport}
              className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Restore Backup
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Always backup your data before importing. Imports will merge with existing data, not replace it.
          </p>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <Database className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
            <p className="text-sm text-gray-600">Manage your stored financial data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Storage Usage</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transactions</span>
                <span className="font-medium">2.4 MB (1,247 records)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Account History</span>
                <span className="font-medium">0.8 MB (365 days)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Goals & Projections</span>
                <span className="font-medium">0.2 MB</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Storage</span>
                  <span>3.4 MB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Data Cleanup</h4>
            <div className="space-y-3">
              <button
                onClick={() => handleDeleteData('old transactions')}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
              >
                <div className="text-left">
                  <p className="font-medium text-gray-900">Delete Old Transactions</p>
                  <p className="text-sm text-gray-600">Remove transactions older than 2 years</p>
                </div>
                <Trash2 className="h-5 w-5 text-red-600" />
              </button>

              <button
                onClick={() => handleDeleteData('unused categories')}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
              >
                <div className="text-left">
                  <p className="font-medium text-gray-900">Clean Unused Categories</p>
                  <p className="text-sm text-gray-600">Remove categories with no transactions</p>
                </div>
                <Trash2 className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Data Protection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Privacy & Data Protection</h2>
            <p className="text-sm text-gray-600">Control how your data is stored and used</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">🔒 Your Data is Private</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• All data is stored locally on your device</li>
              <li>• No financial information is sent to external servers</li>
              <li>• Bank connections use read-only access</li>
              <li>• You can export and delete your data anytime</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Data Retention</h4>
              <p className="text-sm text-gray-600 mb-3">How long to keep transaction history</p>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="1Y">1 Year</option>
                <option value="2Y">2 Years</option>
                <option value="5Y">5 Years</option>
                <option value="forever">Forever</option>
              </select>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Analytics</h4>
              <p className="text-sm text-gray-600 mb-3">Anonymous usage analytics</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={false}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-900 mb-3">⚠️ Danger Zone</h4>
            <div className="space-y-3">
              <button
                onClick={() => handleDeleteData('all')}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Delete All Data
              </button>
              <p className="text-sm text-red-700">
                This will permanently delete all your financial data, accounts, transactions, and goals. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FileText className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Data Overview</h2>
            <p className="text-sm text-gray-600">Summary of your stored financial data</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <p className="text-sm text-gray-600">Transactions</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">4</div>
            <p className="text-sm text-gray-600">Accounts</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <p className="text-sm text-gray-600">Goals</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">365</div>
            <p className="text-sm text-gray-600">Days of History</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="font-semibold text-indigo-900 mb-2">📊 Data Health Score: 95/100</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
            <div>
              <p className="font-medium mb-1">✅ Complete Data</p>
              <p>All accounts have recent transactions and balances</p>
            </div>
            <div>
              <p className="font-medium mb-1">✅ Categorized</p>
              <p>98% of transactions are properly categorized</p>
            </div>
            <div>
              <p className="font-medium mb-1">✅ Goals Tracked</p>
              <p>All savings goals have linked accounts</p>
            </div>
            <div>
              <p className="font-medium mb-1">⚠️ Minor Issues</p>
              <p>3 transactions need manual review</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSettings;