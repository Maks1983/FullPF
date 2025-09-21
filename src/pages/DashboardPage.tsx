import React from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import FinancialHealthScore from '../components/dashboard/FinancialHealthScore';
import MetricsGrid from '../components/dashboard/MetricsGrid';
import { SmartInsights } from '../components/dashboard/SmartInsights';
import GoalsSection from '../components/dashboard/GoalsSection';
import ChartsSection from '../components/dashboard/ChartsSection';
import QuickActions from '../components/dashboard/QuickActions';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <FinancialHealthScore />
            <MetricsGrid />
            <ChartsSection />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <SmartInsights />
            <GoalsSection />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;