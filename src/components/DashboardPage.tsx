import React, { useState, Suspense } from 'react';
import { useDashboardData } from '../hooks/useCentralizedData';
import { useMetricsData } from '../hooks/useMetricsData';
import { activityIcons, insightIcons } from '../theme/icons';

// Import refactored components
import DashboardHeader from './dashboard/DashboardHeader';
import FinancialHealthScore from './dashboard/FinancialHealthScore';
import MetricsGrid from './dashboard/MetricsGrid';
import SmartInsights from './dashboard/SmartInsights';
import GoalsSection from './dashboard/GoalsSection';
import QuickActions from './dashboard/QuickActions';

// Lazy load heavy components
const ChartsSection = React.lazy(() => import('./dashboard/ChartsSection'));

const DashboardPage = () => {
  const [timeframe, setTimeframe] = useState('6M');
  const [refreshing, setRefreshing] = useState(false);

  // Use custom hooks for data management
  const dashboardData = useDashboardData(timeframe);
  const { 
    cashflowData, 
    portfolioData, 
    netWorthData, 
    healthScoreData, 
    smartInsights, 
    goals, 
    recentActivities 
  } = dashboardData;
  
  const { primaryMetrics, secondaryMetrics } = useMetricsData(cashflowData, netWorthData);

  // Financial health score data
  const financialHealthScore = 85;
  const previousScore = 82;

  // Enhanced smart insights with icons from theme
  const enhancedSmartInsights = smartInsights.map(insight => ({
    ...insight,
    icon: insightIcons[insight.type]
  }));

  // Enhanced recent activities with icons from theme
  const enhancedRecentActivities = recentActivities.map(activity => ({
    ...activity,
    icon: activityIcons[activity.type]
  }));

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Enhanced Header with Actions */}
      <DashboardHeader 
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* Financial Health Score */}
      <FinancialHealthScore 
        score={financialHealthScore}
        previousScore={previousScore}
        healthScoreData={healthScoreData}
      />

      {/* Primary and Secondary Metrics */}
      <MetricsGrid 
        primaryMetrics={primaryMetrics}
        secondaryMetrics={secondaryMetrics}
      />

      {/* Smart Insights */}
      <SmartInsights insights={enhancedSmartInsights} />

      {/* Charts Section */}
      <Suspense fallback={
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      }>
        <ChartsSection 
          cashflowData={cashflowData}
          portfolioData={portfolioData}
          netWorthData={netWorthData}
          timeframe={timeframe}
        />
      </Suspense>

      {/* Goals Tracking */}
      <GoalsSection goals={goals} />

      {/* Quick Actions & Recent Activity */}
      <QuickActions recentActivities={enhancedRecentActivities} />
    </div>
  );
};

export default DashboardPage;