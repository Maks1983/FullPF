import React, { useState } from 'react';
import { 
  BarChart3, 
  PiggyBank, 
  CreditCard, 
  TrendingUp, 
  Building, 
  Scale, 
  Wallet,
  Home,
  Calendar,
  Menu,
  X
} from 'lucide-react';
import DashboardPage from './components/DashboardPage';
import CurrentPage from './pages/CurrentPage';
import SavingsPage from './components/SavingsPage';
import DebtsPage from './components/DebtsPage';
import InvestmentsPage from './components/InvestmentsPage';
import AssetsPage from './components/AssetsPage';
import LiabilitiesPage from './components/LiabilitiesPage';
import NetWorthPage from './components/NetWorthPage';

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'current', name: 'Current', icon: Calendar },
  { id: 'savings', name: 'Savings', icon: PiggyBank },
  { id: 'debts', name: 'Debts', icon: CreditCard },
  { id: 'investments', name: 'Investments', icon: TrendingUp },
  { id: 'assets', name: 'Assets', icon: Building },
  { id: 'liabilities', name: 'Liabilities', icon: Scale },
  { id: 'networth', name: 'Net Worth', icon: Wallet },
];

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'current': return <CurrentPage />;
      case 'savings': return <SavingsPage />;
      case 'debts': return <DebtsPage />;
      case 'investments': return <InvestmentsPage />;
      case 'assets': return <AssetsPage />;
      case 'liabilities': return <LiabilitiesPage />;
      case 'networth': return <NetWorthPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">FinanceTracker</h1>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-64 bg-white shadow-sm min-h-screen`}>
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setCurrentPage(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === item.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;