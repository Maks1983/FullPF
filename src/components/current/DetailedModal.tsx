import React, { useId, useMemo, useState } from 'react';
import { X, Calendar, AlertTriangle, ArrowUpRight, TrendingDown, CheckCircle, ListChecks } from 'lucide-react';
import type { UpcomingPayment, SpendingCategory } from '../../types/current';
import HorizontalBarChart from '../charts/HorizontalBarChart';

interface DetailedModalProps {
  isOpen: boolean;
  onClose: () => void;
  upcomingPayments: UpcomingPayment[];
  spendingCategories: SpendingCategory[];
  monthlyIncome: number;
  monthlyExpenses: number;
  totalAvailable: number;
  netLeftoverUntilPaycheck: number;
  daysUntilPaycheck: number;
  todaySpending: number;
}

type TabKey = 'overview' | 'spending' | 'actions';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'spending', label: 'Spending insights' },
  { key: 'actions', label: 'Next steps' }
];

const DetailedModal: React.FC<DetailedModalProps> = ({
  isOpen,
  onClose,
  upcomingPayments,
  spendingCategories,
  monthlyIncome,
  monthlyExpenses,
  totalAvailable,
  netLeftoverUntilPaycheck,
  daysUntilPaycheck,
  todaySpending
}) => {
  const titleId = useId();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  if (!isOpen) return null;

  const outstandingPayments = useMemo(
    () => upcomingPayments.filter(payment => payment.status !== 'paid'),
    [upcomingPayments]
  );

  const nextPayment = outstandingPayments
    .slice()
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  const upcomingPaymentsTotal = outstandingPayments.reduce(
    (sum, payment) => sum + Math.abs(payment.amount),
    0
  );

  const normalizedTodaySpending = Number.isFinite(todaySpending) ? todaySpending : 0;
  const dailyBurnRate = monthlyExpenses > 0 ? monthlyExpenses / 30 : 0;
  const todayDelta = dailyBurnRate > 0 ? normalizedTodaySpending - dailyBurnRate : 0;

  const incomeChartData = useMemo(() => [
    { category: 'Total income', amount: monthlyIncome, color: '#10b981' }
  ], [monthlyIncome]);

  const expenseChartData = useMemo(
    () => spendingCategories
      .map(category => ({
        category: category.name,
        amount: category.spent,
        color: category.color
      }))
      .sort((a, b) => b.amount - a.amount),
    [spendingCategories]
  );

  const actionItems = useMemo(() => {
    const items: { id: string; title: string; detail: string; tone: 'warn' | 'info' | 'positive' }[] = [];

    if (upcomingPaymentsTotal > totalAvailable) {
      items.push({
        id: 'coverage',
        title: 'Cover the remaining bills',
        detail: `Upcoming payments exceed cash by NOK ${(upcomingPaymentsTotal - totalAvailable).toLocaleString('no-NO', { maximumFractionDigits: 0 })}. Consider moving money or delaying non-essentials.`,
        tone: 'warn'
      });
    }

    if (spendingCategories.some(category => category.isOverBudget)) {
      const over = spendingCategories.filter(category => category.isOverBudget);
      items.push({
        id: 'budget',
        title: 'Revisit budgets',
        detail: `${over.length} categor${over.length === 1 ? 'y is' : 'ies are'} over budget. Trim discretionary spend to rebalance.`,
        tone: 'warn'
      });
    }

    if (todayDelta > dailyBurnRate * 0.25) {
      items.push({
        id: 'burn',
        title: 'Slow today\'s spend',
        detail: `Today is NOK ${Math.abs(todayDelta).toLocaleString('no-NO', { maximumFractionDigits: 0 })} above a normal day. Take a pause on discretionary purchases.`,
        tone: 'warn'
      });
    }

    if (items.length === 0) {
      items.push({
        id: 'good-job',
        title: 'Everything looks on track',
        detail: 'Cash covers the upcoming bills and spending sits within plan. Keep following the routine.',
        tone: 'positive'
      });
    }

    return items;
  }, [upcomingPaymentsTotal, totalAvailable, spendingCategories, todayDelta, dailyBurnRate]);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 id={titleId} className="text-xl font-semibold text-gray-900">Detailed cash overview</h2>
            <p className="text-sm text-slate-500">Understand runway, spending and the next decisions</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white border border-transparent hover:border-slate-200"
            aria-label="Close detailed overview"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </header>

        <nav className="flex border-b border-slate-200 bg-white px-6">
          <ul className="flex w-full" role="tablist">
            {tabs.map(tab => (
              <li key={tab.key} className="flex-1">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full px-3 py-3 text-sm font-medium border-b-2 transition ${
                    activeTab === tab.key
                      ? 'text-slate-900 border-slate-600'
                      : 'text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="overflow-y-auto max-h-[65vh] px-6 py-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6" role="tabpanel" aria-labelledby="overview">
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Cash available</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    NOK {totalAvailable.toLocaleString('no-NO', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Upcoming bills</p>
                  <p className="text-2xl font-semibold text-amber-600 mt-1">
                    NOK {upcomingPaymentsTotal.toLocaleString('no-NO', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Runway</p>
                  <p className={`text-2xl font-semibold ${netLeftoverUntilPaycheck >= 0 ? 'text-emerald-600' : 'text-amber-600'} mt-1`}>
                    {netLeftoverUntilPaycheck >= 0 ? 'Covered' : 'Shortfall'}
                  </p>
                  <p className="text-xs text-slate-500">Payday in {daysUntilPaycheck} days</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Today&apos;s spend</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    NOK {normalizedTodaySpending.toLocaleString('no-NO', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-slate-500">
                    Daily baseline {dailyBurnRate.toLocaleString('no-NO', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </section>

              <section className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-800">Next payment</p>
                  {nextPayment ? (
                    <p className="text-sm text-slate-600">
                      {nextPayment.description} • {new Date(nextPayment.dueDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-600">You are clear until payday</p>
                  )}
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p>Outstanding: NOK {upcomingPaymentsTotal.toLocaleString('no-NO', { maximumFractionDigits: 0 })}</p>
                  <p>After bills: NOK {netLeftoverUntilPaycheck.toLocaleString('no-NO', { maximumFractionDigits: 0 })}</p>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'spending' && (
            <div className="space-y-6" role="tabpanel" aria-labelledby="spending">
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Income breakdown</h3>
                  </div>
                  <HorizontalBarChart data={incomeChartData} />
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingDown className="h-4 w-4 text-slate-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Expense categories</h3>
                  </div>
                  <div className="max-h-72 overflow-y-auto pr-2">
                    <HorizontalBarChart data={expenseChartData} />
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Over-budget categories</h3>
                {spendingCategories.some(category => category.isOverBudget) ? (
                  <ul className="space-y-2">
                    {spendingCategories
                      .filter(category => category.isOverBudget)
                      .map(category => (
                        <li key={category.name} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                          {category.name}: {Math.abs(category.remaining).toLocaleString('no-NO', { maximumFractionDigits: 0 })} over plan
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">All tracked categories are within their limits.</p>
                )}
              </section>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-6" role="tabpanel" aria-labelledby="actions">
              <section className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <ListChecks className="h-4 w-4 text-slate-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Recommendations</h3>
                </div>
                <ul className="space-y-3">
                  {actionItems.map(item => (
                    <li
                      key={item.id}
                      className={`rounded-lg px-3 py-2 text-sm ${
                        item.tone === 'warn'
                          ? 'border border-amber-200 bg-amber-50 text-amber-800'
                          : item.tone === 'positive'
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <p className="font-medium">{item.title}</p>
                      <p>{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="h-4 w-4 text-slate-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Upcoming schedule</h3>
                </div>
                <div className="space-y-2">
                  {outstandingPayments.length === 0 ? (
                    <p className="text-sm text-slate-500">No payments left before payday.</p>
                  ) : (
                    outstandingPayments.map(payment => (
                      <div
                        key={payment.id}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                          payment.status === 'overdue'
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : 'border-gray-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(payment.dueDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} • {payment.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">-NOK {Math.abs(payment.amount).toLocaleString('no-NO', { maximumFractionDigits: 0 })}</p>
                          {payment.status === 'overdue' && (
                            <p className="text-xs text-red-600 font-medium">
                              <AlertTriangle className="inline h-3.5 w-3.5 mr-1" />
                              {payment.daysOverdue ?? 0} days overdue
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Ready for payday</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Tick items off as you complete them to keep momentum.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-emerald-700 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>{Math.max(daysUntilPaycheck, 0)} days to go</span>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedModal;
