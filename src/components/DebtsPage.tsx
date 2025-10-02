import React, { useMemo, useState } from 'react';
import { CreditCard, Calendar, TrendingDown, ShieldCheck, Sparkles } from 'lucide-react';
import MetricCard from './common/MetricCard';
import Table from './common/Table';
import { DebtOverviewChart } from '../features/loans/charts/DebtOverviewChart';
import { DebtProgressChart } from '../features/loans/charts/DebtProgressChart';
import { useLoans } from '../features/loans/useLoans';
import {
  calculateDebtSummary,
  formatCurrency,
  formatPercentage,
} from '../features/loans/calculations';
import { useDefaultCurrency } from '../hooks/useDefaultCurrency';
import { LoanSettingsProvider } from '../features/loans/SettingsProvider';
import { LoanList } from '../features/loans/components/LoanList';

const DebtsPage: React.FC = () => {
  const { loans, loading } = useLoans();
  const defaultCurrency = useDefaultCurrency();
  const hasLoans = loans.length > 0;

  const debtSummary = useMemo(() => {
    if (!hasLoans) {
      return {
        totalDebt: 0,
        totalMonthlyPayment: 0,
        totalInterest: 0,
        averageRate: 0,
        payoffDate: new Date(),
        monthsRemaining: 0,
      };
    }

    return calculateDebtSummary(loans);
  }, [loans, hasLoans]);

  const summaryCards = [
    {
      title: 'Total Debt',
      value: formatCurrency(debtSummary.totalDebt, defaultCurrency),
      change: hasLoans ? 'Active' : 'Add loans',
      trend: 'neutral' as const,
      icon: CreditCard,
      color: 'blue' as const,
      subtitle: hasLoans ? 'Across all linked loans' : 'No loans captured yet',
    },
    {
      title: 'Monthly Payments',
      value: formatCurrency(debtSummary.totalMonthlyPayment, defaultCurrency),
      change: hasLoans ? 'Projected' : '—',
      trend: 'neutral' as const,
      icon: Calendar,
      color: 'emerald' as const,
      subtitle: 'Scheduled minimum payments',
    },
    {
      title: 'Average Interest',
      value: hasLoans ? formatPercentage(debtSummary.averageRate) : '0%',
      change: hasLoans ? 'Weighted APR' : '—',
      trend: 'neutral' as const,
      icon: TrendingDown,
      color: 'yellow' as const,
      subtitle: 'Across all active balances',
    },
    {
      title: 'Estimated Payoff',
      value: hasLoans
        ? debtSummary.payoffDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
        : '—',
      change: hasLoans ? `${debtSummary.monthsRemaining} months remaining` : '—',
      trend: 'neutral' as const,
      icon: ShieldCheck,
      color: 'purple' as const,
      subtitle: hasLoans ? 'Based on current pace' : 'Track payoff once loans are added',
    },
  ];

  const loanTableRows = useMemo(
    () =>
      loans.map((loan) => ({
        id: loan.id,
        name: loan.name,
        type: loan.type.replace('_', ' '),
        balance: loan.currentBalance,
        payment: loan.monthlyPayment,
        rate: loan.interestRate,
        termMonths: loan.termMonths,
        currency: loan.currency || defaultCurrency,
      })),
    [loans, defaultCurrency]
  );

  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  const handleSort = (config: { key: string; direction: 'asc' | 'desc' }) => {
    setSortConfig(config);
  };

  const loanColumns = [
    { key: 'name', header: 'Loan', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    {
      key: 'balance',
      header: 'Balance',
      sortable: true,
      render: (value: number, row: (typeof loanTableRows)[number]) => formatCurrency(value, row.currency),
    },
    {
      key: 'payment',
      header: 'Monthly Payment',
      sortable: true,
      render: (value: number, row: (typeof loanTableRows)[number]) => formatCurrency(value, row.currency),
    },
    {
      key: 'rate',
      header: 'APR',
      sortable: true,
      render: (value: number) => formatPercentage(value),
    },
    {
      key: 'termMonths',
      header: 'Term (months)',
      sortable: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Debt Management</h1>
        <p className="text-gray-600">
          Track your active loans, monitor payoff progress, and explore premium optimization tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {hasLoans ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Debt Composition</h3>
            <DebtOverviewChart loans={loans} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Debt Progress</h3>
            <DebtProgressChart loans={loans} />
          </div>
        </div>
      ) : (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center space-y-3">
          <CreditCard className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900">Add your first loan</h3>
          <p className="text-sm text-gray-600">
            Capture mortgages, personal loans, credit cards, and more from Settings → Loans to unlock rich debt analytics here.
          </p>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-900 font-semibold">
            <Sparkles className="w-5 h-5" />
            Premium Boost
          </div>
          <h3 className="text-xl font-bold text-gray-900">Optimize your payoff with advanced strategies</h3>
          <p className="text-sm text-gray-700 max-w-2xl">
            Upgrade to unlock the Strategy Simulator and Debt Optimizer. Test avalanche vs. snowball plans, apply extra payments, and generate smart schedules tailored to your goals.
          </p>
        </div>
        <div className="grid gap-2 text-sm text-blue-900">
          <div className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Strategy Simulator (Premium)</div>
          <div className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Debt Optimizer (Premium)</div>
        </div>
      </div>

      {hasLoans && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Loan Overview</h3>
            <p className="text-sm text-gray-600">Snapshot of all recorded loans. Manage details in Settings → Loans.</p>
          </div>
          <Table data={loanTableRows} columns={loanColumns} sortConfig={sortConfig} onSort={handleSort} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Manage Loans</h3>
          <p className="text-sm text-gray-600">Add, edit, or review loans directly without leaving settings.</p>
        </div>
        <div className="p-6">
          <LoanSettingsProvider>
            <LoanList />
          </LoanSettingsProvider>
        </div>
      </div>
    </div>
  );
};

export default DebtsPage;


