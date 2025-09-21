import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useSavingsData } from '../hooks/useCentralizedData';
import type { TimeframeType } from '../types/financial';
import SavingsNarrativeHeader from './savings/SavingsNarrativeHeader';
import UnifiedAccountGoalCard from './savings/UnifiedAccountGoalCard';
import SmartProjectionChart from './savings/SmartProjectionChart';
import ImpactMetrics from './savings/ImpactMetrics';
import SavingsTransactionsTable from './savings/SavingsTransactionsTable';

const SavingsPage = () => {
  const [projectionMode, setProjectionMode] = useState<'conservative' | 'expected' | 'optimistic'>('expected');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [timeframe, setTimeframe] = useState<TimeframeType>('6M');
  const savingsData = useSavingsData(timeframe);

  const emergencyTarget = 180000;
  const baselineContribution = 8000;
  const acceleratedContribution = 8500;
  const remainingToGoal = Math.max(emergencyTarget - savingsData.currentSavings, 0);

  const monthsToEmergencyGoal = baselineContribution > 0
    ? Math.ceil(remainingToGoal / baselineContribution)
    : 0;
  const acceleratedMonths = acceleratedContribution > 0
    ? Math.ceil(remainingToGoal / acceleratedContribution)
    : 0;
  const monthsSaved = acceleratedMonths > 0 ? monthsToEmergencyGoal - acceleratedMonths : 0;

  const monthsOfCoverage = savingsData.monthlyExpenses > 0
    ? savingsData.currentSavings / savingsData.monthlyExpenses
    : 0;
  const averageMonthlyGrowth = useMemo(() => {
    const history = savingsData.monthlyGrowth;
    if (history.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < history.length; i += 1) {
      total += history[i].value - history[i - 1].value;
    }
    return total / (history.length - 1);
  }, [savingsData.monthlyGrowth]);

  const momentumMultiplier = useMemo(() => {
    const history = savingsData.monthlyGrowth;
    if (history.length < 4) return averageMonthlyGrowth > 0 ? 1 : 0;

    const midpoint = Math.floor(history.length / 2);
    const computeAverageChange = (series: typeof history) => {
      if (series.length < 2) return 0;
      let total = 0;
      for (let i = 1; i < series.length; i += 1) {
        total += series[i].value - series[i - 1].value;
      }
      return total / (series.length - 1);
    };

    const earlier = computeAverageChange(history.slice(0, midpoint + 1));
    const recent = computeAverageChange(history.slice(midpoint));

    if (earlier === 0) {
      return recent > 0 ? 2 : 0;
    }

    return recent / earlier;
  }, [averageMonthlyGrowth, savingsData.monthlyGrowth]);

  const goalWeeksAhead = monthsSaved > 0 ? Math.max(Math.round(monthsSaved * 4), 1) : 0;
  const isAheadOfSchedule = savingsData.savingsRate > 20;
  
  // Enhanced account data with goal connections
  const enhancedAccounts = [
    {
      id: 'emergency',
      name: 'Emergency Fund',
      balance: 82000,
      interestRate: 3.8,
      monthlyContribution: 5000,
      goals: [
        { name: 'Emergency Fund', progress: 46, isPrimary: true },
        { name: 'Peace of Mind', progress: 68, isPrimary: false }
      ],
      runwayMonths: 2.7,
      trend: 'up' as const,
      recentGrowth: 6.2
    },
    {
      id: 'highyield',
      name: 'High Yield Savings',
      balance: 47200,
      interestRate: 4.2,
      monthlyContribution: 3000,
      goals: [
        { name: 'Travel Fund', progress: 78, isPrimary: true },
        { name: 'Emergency Buffer', progress: 12, isPrimary: false }
      ],
      runwayMonths: 1.6,
      trend: 'up' as const,
      recentGrowth: 4.8
    },
    {
      id: 'investment',
      name: 'Investment Savings',
      balance: 25000,
      interestRate: 8.4,
      monthlyContribution: 2000,
      goals: [
        { name: 'House Down Payment', progress: 25, isPrimary: true },
        { name: 'Investment Growth', progress: 45, isPrimary: false }
      ],
      runwayMonths: 0.8,
      trend: 'up' as const,
      recentGrowth: 12.1
    }
  ];

  // Mock transactions with better categorization
  const recentTransactions = [
    { id: 1, date: '2024-01-12', description: 'Emergency Fund Auto-Transfer', amount: 5000.00, type: 'deposit', account: 'Emergency Fund', goalImpact: 'Emergency Fund +2.8%' },
    { id: 2, date: '2024-01-10', description: 'High Yield Interest Payment', amount: 165.00, type: 'interest', account: 'High Yield Savings', goalImpact: 'Travel Fund +0.3%' },
    { id: 3, date: '2024-01-08', description: 'Investment Contribution', amount: 2000.00, type: 'deposit', account: 'Investment Savings', goalImpact: 'House Fund +2.0%' },
    { id: 4, date: '2024-01-05', description: 'Bonus Allocation', amount: 15000.00, type: 'deposit', account: 'High Yield Savings', goalImpact: 'Travel Fund +25%' },
    { id: 5, date: '2024-01-03', description: 'Emergency Car Repair', amount: -8500.00, type: 'withdrawal', account: 'Emergency Fund', goalImpact: 'Emergency Fund -4.7%' },
  ];

  const transactionColumns = [
    { key: 'date', header: 'Date', sortable: true },
    { key: 'description', header: 'Description', sortable: true },
    { key: 'account', header: 'Account', sortable: true },
    { 
      key: 'type', 
      header: 'Type', 
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'deposit' ? 'bg-green-100 text-green-800' :
          value === 'withdrawal' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    { 
      key: 'amount', 
      header: 'Amount', 
      sortable: true, 
      render: (value: number) => (
        <span className={value > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
          {value > 0 ? '+' : ''}{value.toLocaleString()} NOK
        </span>
      )
    },
    {
      key: 'goalImpact',
      header: 'Goal Impact',
      sortable: false,
      render: (value: string) => (
        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
          {value}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Narrative Header */}
      <SavingsNarrativeHeader
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        goalName="Emergency Fund"
        targetAmount={emergencyTarget}
        currentSavings={savingsData.currentSavings}
        remainingToGoal={remainingToGoal}
        coverageMonths={monthsOfCoverage}
        savingsRate={savingsData.savingsRate}
        averageMonthlyGrowth={averageMonthlyGrowth}
        monthsToGoal={monthsToEmergencyGoal}
        monthsSaved={monthsSaved}
        goalWeeksAhead={goalWeeksAhead}
        momentumMultiplier={momentumMultiplier}
        isAheadOfSchedule={isAheadOfSchedule}
      />

      {/* Impact-Oriented Metrics */}
      <ImpactMetrics
        monthsOfCoverage={monthsOfCoverage}
        growthMultiplier={2.1}
        runwayAmount={15000}
        totalSavings={savingsData.currentSavings}
      />

      {/* Unified Account + Goal Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Your Wealth-Building Accounts</h3>
            <p className="text-sm text-gray-600 mt-1">Each account is working toward your financial goals</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Start New Goal
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {enhancedAccounts.map((account) => (
            <UnifiedAccountGoalCard
              key={account.id}
              account={account}
            />
          ))}
        </div>
      </div>

      {/* Smart Projection Chart */}
      <SmartProjectionChart
        currentSavings={savingsData.currentSavings}
        monthlyGrowth={savingsData.monthlyGrowth}
        projectionMode={projectionMode}
        onProjectionModeChange={setProjectionMode}
      />

      {/* Recent Transactions with Goal Impact */}
      <SavingsTransactionsTable
        transactions={recentTransactions}
        columns={transactionColumns}
        sortConfig={sortConfig}
        onSort={setSortConfig}
      />
    </div>
  );
};

export default SavingsPage;
