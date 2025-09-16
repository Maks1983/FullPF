@@ .. @@
-import React, { Suspense } from 'react';
-import { useFinancialData } from '../hooks/useFinancialData';
-import { useMetricsData } from '../hooks/useMetricsData';
-import { useDashboard } from '../context/DashboardContext';
-import { activityIcons, insightIcons } from '../theme/icons';
-
-// Import refactored components
-import DashboardHeader from '../components/dashboard/DashboardHeader';
-import FinancialHealthScore from '../components/dashboard/FinancialHealthScore';
-import MetricsGrid from '../components/dashboard/MetricsGrid';
-import SmartInsights from '../components/dashboard/SmartInsights';
-import GoalsSection from '../components/dashboard/GoalsSection';
-import QuickActions from '../components/dashboard/QuickActions';
-
-// Lazy load heavy components
-const ChartsSection = React.lazy(() => import('../components/dashboard/ChartsSection'));
-
-const DashboardPage = () => {
-  const { timeframe, setTimeframe, refreshing, handleRefresh } = useDashboard();
-
-  // Use custom hooks for data management
-  const { 
-    cashflowData, 
-    portfolioData, 
-    netWorthData, 
-    healthScoreData, 
-    smartInsights, 
-    goals, 
-    recentActivities 
-  } = useFinancialData(timeframe);
-  
-  const { primaryMetrics, secondaryMetrics } = useMetricsData(cashflowData, netWorthData);
-
-  // Financial health score data
-  const financialHealthScore = 85;
-  const previousScore = 82;
-
-  // Enhanced smart insights with icons from theme
-  const enhancedSmartInsights = smartInsights.map(insight => ({
-    ...insight,
-    icon: insightIcons[insight.type]
-  }));
-
-  // Enhanced recent activities with icons from theme
-  const enhancedRecentActivities = recentActivities.map(activity => ({
-    ...activity,
-    icon: activityIcons[activity.type]
-  }));
-
-  return (
-    <div className="space-y-8 pb-8">
-      {/* Enhanced Header with Actions */}
-      <DashboardHeader 
-        timeframe={timeframe}
-        setTimeframe={setTimeframe}
-        refreshing={refreshing}
-        onRefresh={handleRefresh}
-      />
-
-      {/* Financial Health Score */}
-      <FinancialHealthScore 
-        score={financialHealthScore}
-        previousScore={previousScore}
-        healthScoreData={healthScoreData}
-      />
-
-      {/* Primary and Secondary Metrics */}
-      <MetricsGrid 
-        primaryMetrics={primaryMetrics}
-        secondaryMetrics={secondaryMetrics}
-      />
-
-      {/* Smart Insights */}
-      <SmartInsights insights={enhancedSmartInsights} />
-
-      {/* Charts Section */}
-      <Suspense fallback={
-        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 animate-pulse">
-          <div className="h-64 bg-gray-200 rounded"></div>
-        </div>
-      }>
-        <ChartsSection 
-          cashflowData={cashflowData}
-          portfolioData={portfolioData}
-          netWorthData={netWorthData}
-          timeframe={timeframe}
-        />
-      </Suspense>
-
-      {/* Goals Tracking */}
-      <GoalsSection goals={goals} />
-
-      {/* Quick Actions & Recent Activity */}
-      <QuickActions recentActivities={enhancedRecentActivities} />
-    </div>
-  );
-};
-
-export default DashboardPage;
+import React, { Suspense } from 'react';
+import { useDashboardData } from '../hooks/useCentralizedData';
+import { useMetricsData } from '../hooks/useMetricsData';
+import { useDashboard } from '../context/DashboardContext';
+import { activityIcons, insightIcons } from '../theme/icons';
+
+// Import refactored components
+import DashboardHeader from '../components/dashboard/DashboardHeader';
+import FinancialHealthScore from '../components/dashboard/FinancialHealthScore';
+import MetricsGrid from '../components/dashboard/MetricsGrid';
+import SmartInsights from '../components/dashboard/SmartInsights';
+import GoalsSection from '../components/dashboard/GoalsSection';
+import QuickActions from '../components/dashboard/QuickActions';
+
+// Lazy load heavy components
+const ChartsSection = React.lazy(() => import('../components/dashboard/ChartsSection'));
+
+const DashboardPage = () => {
+  const { timeframe, setTimeframe, refreshing, handleRefresh } = useDashboard();
+
+  // Use centralized data hooks
+  const dashboardData = useDashboardData(timeframe);
+  const { primaryMetrics, secondaryMetrics } = useMetricsData(timeframe);
+
+  // Financial health score data
+  const financialHealthScore = 85;
+  const previousScore = 82;
+
+  // Enhanced smart insights with icons from theme
+  const enhancedSmartInsights = dashboardData.smartInsights.map(insight => ({
+    ...insight,
+    icon: insightIcons[insight.type]
+  }));
+
+  // Enhanced recent activities with icons from theme
+  const enhancedRecentActivities = dashboardData.recentActivities.map(activity => ({
+    ...activity,
+    icon: activityIcons[activity.type]
+  }));
+
+  return (
+    <div className="space-y-8 pb-8">
+      {/* Enhanced Header with Actions */}
+      <DashboardHeader 
+        timeframe={timeframe}
+        setTimeframe={setTimeframe}
+        refreshing={refreshing}
+        onRefresh={handleRefresh}
+      />
+
+      {/* Financial Health Score */}
+      <FinancialHealthScore 
+        score={financialHealthScore}
+        previousScore={previousScore}
+        healthScoreData={dashboardData.healthScoreData}
+      />
+
+      {/* Primary and Secondary Metrics */}
+      <MetricsGrid 
+        primaryMetrics={primaryMetrics}
+        secondaryMetrics={secondaryMetrics}
+      />
+
+      {/* Smart Insights */}
+      <SmartInsights insights={enhancedSmartInsights} />
+
+      {/* Charts Section */}
+      <Suspense fallback={
+        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 animate-pulse">
+          <div className="h-64 bg-gray-200 rounded"></div>
+        </div>
+      }>
+        <ChartsSection 
+          cashflowData={dashboardData.cashflowData}
+          portfolioData={dashboardData.portfolioData}
+          netWorthData={dashboardData.netWorthData}
+          timeframe={timeframe}
+        />
+      </Suspense>
+
+      {/* Goals Tracking */}
+      <GoalsSection goals={dashboardData.goals} />
+
+      {/* Quick Actions & Recent Activity */}
+      <QuickActions recentActivities={enhancedRecentActivities} />
+    </div>
+  );
+};
+
+export default DashboardPage;