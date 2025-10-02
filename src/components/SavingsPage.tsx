import React, { useMemo, useState } from 'react';
import { Plus, AlertCircle, TrendingUp, Target, DollarSign, Calendar, PiggyBank, ShieldCheck, CalendarClock, Zap } from 'lucide-react';
import { useSavingsData } from '../hooks/useCentralizedData';
import type { TimeframeType } from '../types/financial';
import SavingsNarrativeHeader, { type SavingsKpi, type PremiumSuggestion } from './savings/SavingsNarrativeHeader';
import UnifiedAccountGoalCard from './savings/UnifiedAccountGoalCard';
import SmartProjectionChart from './savings/SmartProjectionChart';
//import ImpactMetrics from './savings/ImpactMetrics.tsx.old';
import SavingsTransactionsTable from './savings/SavingsTransactionsTable';
import SmartSavingsSuggestions from './savings/SmartSavingsSuggestions';

const formatCurrency = (value: number) => `NOK ${value.toLocaleString('no-NO', { maximumFractionDigits: 0 })}`;

const addMonths = (date: Date, count: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + count);
  return result;
};

const SavingsPage = () => {
  const [projectionMode, setProjectionMode] = useState<'conservative' | 'expected' | 'optimistic'>('expected');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [timeframe, setTimeframe] = useState<TimeframeType>('6M');

  const [isBoostPlannerOpen, setIsBoostPlannerOpen] = useState(false);
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

  const monthsOfCoverage = savingsData.emergencyCoverageMonths ?? 0;
  const averageMonthlyGrowth = useMemo(() => {
    const history = savingsData.monthlyGrowth;
    if (history.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < history.length; i += 1) {
      total += history[i].value - history[i - 1].value;
    }
    return total / (history.length - 1);
  }, [savingsData.monthlyGrowth]);

  const goalWeeksAhead = monthsSaved > 0 ? Math.max(Math.round(monthsSaved * 4), 1) : 0;
  const isAheadOfSchedule = savingsData.savingsRate > 20;
  const emergencyGoalProgress = savingsData.emergencyGoalProgress ?? 0;
  const isEmergencyGoalComplete = savingsData.isEmergencyGoalComplete;
  const hasAdditionalGoals = savingsData.hasAdditionalGoals;
  const nextGoal = savingsData.nextGoal;
  const hasHighInterestDebt = savingsData.hasHighInterestDebt;
  const highestDebtRate = savingsData.highestDebtRate;
  const highestDebtName = savingsData.highestDebtName;
  const isPremiumUser = savingsData.isPremiumUser;

  //const nextGoalRemaining = nextGoal ? Math.max(nextGoal.target - nextGoal.current, 0) : 0;
  const nextGoalMonthsToTarget = nextGoal?.monthsToTarget ?? null;
  const nextGoalProjectedDate = nextGoalMonthsToTarget
    ? addMonths(new Date(), nextGoalMonthsToTarget)
    : null;
  const nextGoalProjectedLabel = nextGoalProjectedDate
    ? nextGoalProjectedDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : null;
  const nextGoalProgress = nextGoal?.progress ?? 0;

  const projectedGoalDate = monthsToEmergencyGoal > 0 ? addMonths(new Date(), monthsToEmergencyGoal) : null;
  const projectedGoalDateLabel = projectedGoalDate
    ? projectedGoalDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : 'Goal reached';
  //const monthsSavedCopy = monthsSaved > 0 ? `${monthsSaved} month${monthsSaved === 1 ? '' : 's'} faster` : null;
  const coverageGapMonths = Math.max(6 - monthsOfCoverage, 0);
  const boostDeltaMonthly = acceleratedContribution - baselineContribution;

  const cockpitState: 'foundationInProgress' | 'foundationCompleteNoGoals' | 'foundationCompleteWithGoals' = !isEmergencyGoalComplete
    ? 'foundationInProgress'
    : hasAdditionalGoals
      ? 'foundationCompleteWithGoals'
      : 'foundationCompleteNoGoals';

  const heroContent = (() => {
    switch (cockpitState) {
      case 'foundationCompleteNoGoals':
        return {
          title: '🎉 Your Emergency Fund is complete! Now it’s time to focus on wealth growth.',
          subtitle: 'Redirect your savings power toward investing, debt payoff, or a fresh goal.',
        };
      case 'foundationCompleteWithGoals':
        return {
          title: '🎉 Emergency Fund secure! Focus on your next goal.',
          subtitle: nextGoal
            ? `${nextGoal.name} is ${nextGoalProgress.toFixed(0)}% funded. Stay consistent to reach it by ${nextGoalProjectedLabel}.`
            : 'Keep your savings flowing toward the goals that matter next.',
        };
      default:
        return {
          title: 'Emergency Fund progress in motion',
          subtitle: goalWeeksAhead > 0
            ? `🎉 Ahead by ~${goalWeeksAhead} week${goalWeeksAhead === 1 ? '' : 's'}! Stay consistent to protect your runway.`
            : `About ${monthsToEmergencyGoal} month${monthsToEmergencyGoal === 1 ? '' : 's'} to full coverage at this pace.`,
        };
    }
  })();

  const emergencyPercent = Number.isFinite(emergencyGoalProgress) ? emergencyGoalProgress : 0;
  const boundedEmergencyPercent = Math.max(0, Math.min(emergencyPercent, 999));
  const emergencyStatusValue = `${boundedEmergencyPercent.toFixed(0)}% • ${monthsOfCoverage.toFixed(1)} months`;
  const emergencyStatusHelper = coverageGapMonths > 0
    ? `${coverageGapMonths.toFixed(1)} month${coverageGapMonths === 1 ? '' : 's'} to 6-month target`
    : 'Six-month safety net secure';

  const emergencyTone: SavingsKpi['tone'] = coverageGapMonths <= 0
    ? 'positive'
    : coverageGapMonths <= 1
      ? 'info'
      : 'caution';

  const projectedFinishValue = projectedGoalDateLabel;
  const projectedFinishHelper = goalWeeksAhead > 0
    ? `Ahead by ~${goalWeeksAhead} week${goalWeeksAhead === 1 ? '' : 's'}`
    : monthsToEmergencyGoal > 0
      ? `~${monthsToEmergencyGoal} month${monthsToEmergencyGoal === 1 ? '' : 's'} remaining`
      : 'Emergency fund target achieved';

  const projectedTone: SavingsKpi['tone'] = goalWeeksAhead > 0 || monthsToEmergencyGoal <= 0 ? 'positive' : 'info';

  const { boostPotentialValue, boostPotentialSubtitle, boostPotentialTone } = (() => {
    if (monthsSaved > 0) {
      return {
        boostPotentialValue: `+${monthsSaved} month${monthsSaved === 1 ? '' : 's'} faster`,
        boostPotentialSubtitle: 'Use the boost planner to lock in a faster finish.',
        boostPotentialTone: 'positive' as SavingsKpi['tone'],
      };
    }

    if (boostDeltaMonthly > 0) {
      return {
        boostPotentialValue: `Redirect ${formatCurrency(boostDeltaMonthly)} / month`,
        boostPotentialSubtitle: 'Use the boost planner to lock in a faster finish.',
        boostPotentialTone: 'info' as SavingsKpi['tone'],
      };
    }

    return {
      boostPotentialValue: '+1 month faster',
      boostPotentialSubtitle: 'Use the boost planner to lock in a faster finish.',
      boostPotentialTone: 'info' as SavingsKpi['tone'],
    };
  })();

  const emergencyIconClasses = coverageGapMonths > 0
    ? { container: 'bg-amber-500/10 border-amber-400/30', icon: 'text-amber-300' }
    : { container: 'bg-emerald-500/10 border-emerald-400/30', icon: 'text-emerald-300' };

  const projectedIconClasses = goalWeeksAhead > 0 || monthsToEmergencyGoal <= 0
    ? { container: 'bg-emerald-500/10 border-emerald-400/30', icon: 'text-emerald-300' }
    : { container: 'bg-sky-500/10 border-sky-400/30', icon: 'text-sky-300' };

  const boostIconClasses = boostPotentialTone === 'positive'
    ? { container: 'bg-emerald-500/10 border-emerald-400/30', icon: 'text-emerald-300' }
    : boostPotentialTone === 'caution'
      ? { container: 'bg-amber-500/10 border-amber-400/30', icon: 'text-amber-300' }
      : { container: 'bg-sky-500/10 border-sky-400/30', icon: 'text-sky-300' };

  const openBoostPlanner = () => setIsBoostPlannerOpen(true);
  const closeBoostPlanner = () => setIsBoostPlannerOpen(false);

  const boostPlannerIntro = !isEmergencyGoalComplete
    ? 'Even small changes to flexible spending can speed up your Emergency Fund progress.'
    : 'Dial in small spending tweaks to fuel your next goal even faster.';

  const boostPlannerExamples = [
    { id: 'dining-out', title: 'Dining out', amount: 'NOK 2,300/month', tip: 'Trim 20% frees NOK 460' },
    { id: 'subscriptions', title: 'Subscriptions', amount: 'NOK 450/month', tip: 'Cancel unused frees NOK 200' },
    { id: 'shopping', title: 'Shopping (non-essential)', amount: 'NOK 1,200/month', tip: 'Set a small cap saves NOK 200' },
  ];

  const boostPlannerSummary = 'Redirecting NOK 860/month could help you finish your Emergency Fund 2 months faster.';
  const boostPlannerNote = 'These are examples. Even redirecting one category consistently makes a big difference.';

  const baseKpis: SavingsKpi[] = [
    {
      id: 'balance',
      label: 'Current savings balance',
      value: formatCurrency(savingsData.currentSavings),
      helper: 'Total across all savings accounts',
      icon: PiggyBank,
      iconClassName: 'text-emerald-300',
      iconContainerClassName: 'bg-emerald-500/10 border-emerald-400/30',
    },
    {
      id: 'emergency-status',
      label: 'Emergency fund status',
      value: emergencyStatusValue,
      helper: emergencyStatusHelper,
      tone: emergencyTone,
      icon: ShieldCheck,
      iconClassName: emergencyIconClasses.icon,
      iconContainerClassName: emergencyIconClasses.container,
    },
    {
      id: 'projected-finish',
      label: 'Projected finish date',
      value: projectedFinishValue,
      helper: projectedFinishHelper,
      tone: projectedTone,
      icon: CalendarClock,
      iconClassName: projectedIconClasses.icon,
      iconContainerClassName: projectedIconClasses.container,
    },
    {
      id: 'boost-potential',
      label: 'Boost potential',
      value: boostPotentialValue,
      helper: boostPotentialSubtitle,
      tone: boostPotentialTone,
      icon: Zap,
      iconClassName: boostIconClasses.icon,
      iconContainerClassName: boostIconClasses.container,
      onClick: openBoostPlanner,
    },
  ];
  const premiumSuggestions: PremiumSuggestion[] = useMemo(() => {
    if (!isPremiumUser) {
      return [];
    }

    const suggestions: PremiumSuggestion[] = [];
    const formattedDebtRate = highestDebtRate ? highestDebtRate.toFixed(1) : null;
    const nextGoalName = nextGoal?.name ?? 'your goal';

    if (cockpitState === 'foundationInProgress') {
      if (hasHighInterestDebt && highestDebtRate && highestDebtName && formattedDebtRate) {
        suggestions.push({
          id: 'debt-balance',
          title: `${highestDebtName} at ${formattedDebtRate}% APR`,
          description: 'Split contributions: keep a 2-month buffer growing while funneling extra cash toward this high-cost debt.',
          action: 'Plan a hybrid payoff + savings schedule',
          color: 'red',
          icon: AlertCircle,
        });
      }

      suggestions.push({
        id: 'momentum-check',
        title: 'Protect your momentum',
        description: 'Schedule a monthly check-in to keep contributions and spending aligned with your emergency goal.',
        action: 'Add a recurring calendar reminder',
        color: 'blue',
        icon: Calendar,
      });

      suggestions.push({
        id: 'auto-transfer',
        title: 'Automate your transfer cadence',
        description: 'Lock in a recurring contribution so progress continues even when life gets busy.',
        action: 'Customize monthly auto-transfer',
        color: 'green',
        icon: DollarSign,
      });

      return suggestions;
    }

    if (cockpitState === 'foundationCompleteNoGoals') {
      if (hasHighInterestDebt && highestDebtRate && highestDebtName) {
        suggestions.push({
          id: 'debt-focus',
          title: `Redirect to ${highestDebtName}`,
          description: `${formattedDebtRate ? `${formattedDebtRate}% APR ` : ''}debt still drags on cash flow. Clearing it now frees your monthly surplus.`,
          action: 'Set a targeted payoff amount',
          color: 'red',
          icon: AlertCircle,
        });
      }

      suggestions.push({
        id: 'investing-path',
        title: 'Shift into wealth growth',
        description: 'With your buffer locked in, dedicate a fixed percentage of income toward investing each month.',
        action: 'Draft an investing contribution plan',
        color: 'green',
        icon: TrendingUp,
      });

      suggestions.push({
        id: 'new-goal',
        title: 'Define a fresh savings mission',
        description: 'Travel fund? Home upgrade? Create a clear target so your savings stays purposeful.',
        action: 'Create a new savings goal',
        color: 'yellow',
        icon: Target,
      });

      return suggestions;
    }

    if (nextGoal) {
      suggestions.push({
        id: 'goal-boost',
        title: `Fine-tune ${nextGoalName}`,
        description: 'Review your contribution amount to see if a small adjustment keeps you ahead of schedule.',
        action: 'Adjust goal contribution',
        color: 'blue',
        icon: Target,
      });
    }

    if (hasHighInterestDebt && highestDebtRate && highestDebtName) {
      suggestions.push({
        id: 'debt-opportunity',
        title: 'Balance saving with debt payoff',
        description: `Direct part of your surplus toward ${highestDebtName} (${highestDebtRate.toFixed(1)}% APR) while funding ${nextGoalName}.`,
        action: 'Build a hybrid payoff plan',
        color: 'red',
        icon: AlertCircle,
      });
    }

    if (isAheadOfSchedule) {
      suggestions.push({
        id: 'invest-comparison',
        title: 'Put surplus to work',
        description: 'Model investing some of your savings surplus to accelerate long-term growth.',
        action: 'Run an allocation scenario',
        color: 'green',
        icon: TrendingUp,
      });
    } else {
      suggestions.push({
        id: 'cashflow-check',
        title: 'Track daily runway',
        description: 'Keep an eye on discretionary spending so your contributions stay consistent.',
        action: 'Set daily spending alerts',
        color: 'yellow',
        icon: Calendar,
      });
    }

    return suggestions;
  }, [isPremiumUser, cockpitState, hasHighInterestDebt, highestDebtRate, highestDebtName, nextGoal, isAheadOfSchedule]);
  const showAnalytics = cockpitState !== 'foundationCompleteNoGoals';

  // Enhanced account data with goal connections (placeholder static data for now)
  const enhancedAccounts = [
    {
      id: 'emergency',
      name: 'Emergency Fund',
      balance: 82000,
      interestRate: 3.8,
      monthlyContribution: 5000,
      goals: [
        { name: 'Emergency Fund', progress: 46, isPrimary: true }
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
        { name: 'Travel Fund', progress: 78, isPrimary: true }
      ],
      runwayMonths: 1.6,
      trend: 'up' as const,
      recentGrowth: 4.8
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
    <>
      <div className="space-y-8 pb-8">
      <SavingsNarrativeHeader
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        state={cockpitState}
        heroTitle={heroContent.title}
        heroSubtitle={heroContent.subtitle}
        kpis={baseKpis}
        goalWeeksAhead={goalWeeksAhead}
        isPremiumUser={isPremiumUser}
      />

      <div className="space-y-6 lg:grid lg:grid-cols-[0.7fr_0.3fr] lg:gap-6 lg:space-y-0 lg:items-stretch">
        <div className="order-1 lg:order-2 flex flex-col space-y-4 lg:h-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900">Your Savings Accounts & Goals</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Add Account
            </button>
          </div>

          <div className="grid gap-4 lg:flex-1 lg:overflow-y-auto lg:pr-2 lg:pt-1">
            {enhancedAccounts.map((account) => (
              <UnifiedAccountGoalCard
                key={account.id}
                account={account}
              />
            ))}
          </div>
        </div>

        <div className="order-2 lg:order-1 lg:h-full">
          {showAnalytics ? (
            <SmartProjectionChart
              currentSavings={savingsData.currentSavings}
              monthlyGrowth={savingsData.monthlyGrowth}
              projectionMode={projectionMode}
              onProjectionModeChange={setProjectionMode}
            />
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-600 shadow-sm lg:h-full">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Foundational goal already achieved</h4>
              <p className="leading-relaxed">
                Your emergency fund is fully funded. Redirect projections toward new goals once you define them, or explore investing and debt payoff scenarios first.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Smart Savings Suggestions */}
      <SmartSavingsSuggestions
        currentSavings={savingsData.currentSavings}
        monthlyContribution={baselineContribution}
        savingsRate={savingsData.savingsRate}
        monthsOfCoverage={monthsOfCoverage}
        goalProgress={(savingsData.currentSavings / emergencyTarget) * 100}
        targetAmount={emergencyTarget}
        monthsToGoal={monthsToEmergencyGoal}
        averageMonthlyGrowth={averageMonthlyGrowth}
        totalMonthlyIncome={52000}
      />

      <SavingsTransactionsTable
        transactions={recentTransactions}
        columns={transactionColumns}
        sortConfig={sortConfig}
        onSort={setSortConfig}
      />
    </div>

    {isBoostPlannerOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={closeBoostPlanner}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="boost-planner-title"
          className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl"
        >
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 id="boost-planner-title" className="text-lg font-semibold text-slate-900">
                Boost Planner
              </h2>
              <p className="mt-1 text-sm text-slate-600">{boostPlannerIntro}</p>
            </div>
            <button
              type="button"
              onClick={closeBoostPlanner}
              className="rounded-full p-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              <span className="sr-only">Close</span>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="px-6 py-5 space-y-5">
            <div className="space-y-3">
              {boostPlannerExamples.map((example) => (
                <div
                  key={example.id}
                  className="flex items-start justify-between rounded-lg border border-slate-200 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{example.title}</p>
                    <p className="text-xs text-slate-500">{example.amount}</p>
                  </div>
                  <p className="text-sm font-semibold text-emerald-600">{example.tip}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-sm font-semibold text-emerald-800">{boostPlannerSummary}</p>
            </div>
            <p className="text-xs text-slate-500">{boostPlannerNote}</p>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={closeBoostPlanner}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              Close
            </button>
            <button
              type="button"
              onClick={closeBoostPlanner}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
};

export default SavingsPage;



