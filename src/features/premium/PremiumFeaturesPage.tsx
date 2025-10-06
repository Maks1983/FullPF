import React from 'react';
import {
  CreditCard,
  Target,
  TrendingUp,
  Sparkles,
  FileText,
  BarChart3,
  Crown,
} from 'lucide-react';
import type { LicenseTier } from '../../context/AdminFoundation';
import { useLicenseGating } from '../../hooks/useLicenseGating';

type RiskTone = 'low' | 'medium' | 'mixed';
type ScenarioTone = 'positive' | 'neutral' | 'caution';
type LicenseFeatureKey =
  | 'smartInsights'
  | 'smartSuggestions'
  | 'advancedAnalytics'
  | 'premiumReports'
  | 'bankIntegration';

interface FeatureScenario {
  label: string;
  description: string;
  tone: ScenarioTone;
}

interface FeatureHighlight {
  title: string;
  description: string;
}

interface FeatureSection {
  id: string;
  title: string;
  icon: React.ElementType;
  premiumBenefit: string;
  standardFeature: string;
  visual: string;
  risk: {
    label: string;
    description: string;
    tone: RiskTone;
  };
  scenarios?: FeatureScenario[];
  highlights?: FeatureHighlight[];
}

const licenseFeatureLabels: Record<LicenseFeatureKey, string> = {
  smartInsights: 'Smart insights',
  smartSuggestions: 'Strategy simulator',
  advancedAnalytics: 'Advanced analytics',
  premiumReports: 'Premium reports',
  bankIntegration: 'Bank integration',
};

const tierDisplay: Record<LicenseTier, string> = {
  free: 'Free',
  advanced: 'Advanced',
  premium: 'Premium',
  family: 'Family',
};

const sectionFeatureKeyMap: Partial<Record<string, LicenseFeatureKey>> = {
  'bank-card-sync': 'bankIntegration',
  'debt-optimizer': 'advancedAnalytics',
  'strategy-simulator': 'smartSuggestions',
  'premium-insights': 'smartInsights',
  'premium-reports': 'premiumReports',
  'advanced-analytics': 'advancedAnalytics',
};

const premiumFeatureSections: FeatureSection[] = [
  {
    id: 'bank-card-sync',
    title: 'Live Bank & Card Sync',
    icon: CreditCard,
    premiumBenefit:
      'Connect unlimited institutions with hourly refreshes, merchant deduplication, and automatic category detection tuned to your spending profile.',
    standardFeature:
      'Manual account updates with CSV uploads and twice-monthly refresh reminders.',
    visual:
      'Unified balance view with sync status chips, latency trend line, and anomaly callouts when a feed stalls.',
    risk: {
      label: 'Tokenized connections',
      description: 'Connections stay read-only with rotating tokens and device fingerprinting.',
      tone: 'low',
    },
    scenarios: [
      {
        label: 'Frequent traveler',
        description: 'Keeps cards synced while you move between currencies and institutions.',
        tone: 'positive',
      },
      {
        label: 'Side hustle expansion',
        description: 'Flags duplicate business expenses across personal cards before export.',
        tone: 'neutral',
      },
      {
        label: 'Bank outage',
        description: 'Displays last-good-sync time and pauses automation until connectivity stabilizes.',
        tone: 'caution',
      },
    ],
    highlights: [
      {
        title: 'Unlimited institutions',
        description: 'Link as many checking, savings, credit card, and loan accounts as you need.',
      },
      {
        title: 'Auto categorization',
        description: 'Machine learning classifications adapt to every recategorization you make.',
      },
      {
        title: 'Connection health',
        description: 'Jitters refreshes to avoid rate limits and surfaces remediation tips instantly.',
      },
    ],
  },
  {
    id: 'strategy-simulator',
    title: 'Strategy Simulator',
    icon: Target,
    premiumBenefit:
      'Compare payoff, savings, and investment strategies with slider-controlled inputs, risk tolerances, and override assumptions before committing funds.',
    standardFeature:
      'Straight-line goal planner that assumes fixed monthly contributions and static timelines.',
    visual:
      'Scenario dashboard with goal completion gauges, cash runway chart, and alerts when assumptions drift outside guardrails.',
    risk: {
      label: 'Assumption sensitive',
      description: 'Outputs reflect the probability range of the chosen Monte Carlo model.',
      tone: 'mixed',
    },
    scenarios: [
      {
        label: 'Aggressive debt payoff',
        description: 'Shows interest saved and timeline acceleration when you redirect surplus cash.',
        tone: 'positive',
      },
      {
        label: 'Family budgeting',
        description: 'Surfaces spending caps needed to hit education and vacation goals simultaneously.',
        tone: 'neutral',
      },
      {
        label: 'Market correction',
        description: 'Highlights worst-case drawdown and suggests liquidity buffers before proceeding.',
        tone: 'caution',
      },
    ],
    highlights: [
      {
        title: 'Scenario snapshots',
        description: 'Save what-if versions and compare them side-by-side with baseline performance.',
      },
      {
        title: 'Dynamic guardrails',
        description: 'Automatic guardrails flag contributions or withdrawals that break your plan.',
      },
      {
        title: 'Audit trail',
        description: 'Every simulation is logged with the inputs, owner, and confidence interval.',
      },
    ],
  },
  {
    id: 'premium-insights',
    title: 'Premium Insights Stream',
    icon: Sparkles,
    premiumBenefit:
      'Daily insight stream surfaces spending heuristics, habit nudges, and anomaly detection tuned to household trends and seasonality.',
    standardFeature: 'Weekly digest with generic budgeting tips and high-level charts.',
    visual:
      'Insight cards with tone badges, projected savings meters, and quick-action buttons.',
    risk: {
      label: 'Read-only analysis',
      description: 'Insights rely on aggregated metrics with no direct account changes.',
      tone: 'low',
    },
    scenarios: [
      {
        label: 'Cash flow surge',
        description: 'Identifies surplus after a bonus and suggests buckets aligned to your goals.',
        tone: 'positive',
      },
      {
        label: 'Payday variance',
        description: 'Balances irregular income with recommended reserve adjustments.',
        tone: 'neutral',
      },
      {
        label: 'Subscription creep',
        description: 'Detects stacked subscriptions and recommends cancellations before renewals.',
        tone: 'caution',
      },
    ],
    highlights: [
      {
        title: 'Personalized nudges',
        description: 'Each suggestion references the exact accounts, categories, and outcomes affected.',
      },
      {
        title: 'Household filters',
        description: 'Filter insights by household member, budget envelope, or business entity.',
      },
      {
        title: 'Explainability',
        description: 'Every nudge explains the data points, so stakeholders can approve with confidence.',
      },
    ],
  },
  {
    id: 'premium-reports',
    title: 'Premium Reporting Suite',
    icon: FileText,
    premiumBenefit:
      'Generate export-ready quarterly packets with budgets, cash flow statements, and bank audit trails in one click.',
    standardFeature: 'Basic month summary with CSV export of transactions.',
    visual:
      'Report selector with preview thumbnails, time-range controls, and compliance badges for export formats.',
    risk: {
      label: 'Data handling',
      description: 'Exports inherit the same masking rules applied across the admin console.',
      tone: 'low',
    },
    scenarios: [
      {
        label: 'CPA handoff',
        description: 'Bundle reconciled ledgers, receipts, and notes for quarterly reviews.',
        tone: 'positive',
      },
      {
        label: 'Loan application',
        description: 'Provide lenders with standardized statements and debt schedules instantly.',
        tone: 'neutral',
      },
      {
        label: 'Dispute response',
        description: 'Produce the exact transaction trail needed to respond to disputes.',
        tone: 'caution',
      },
    ],
    highlights: [
      {
        title: 'Versioned exports',
        description: 'Lock and reference every export by checksum for compliance and audits.',
      },
      {
        title: 'Branding controls',
        description: 'Apply letterheads, color palettes, and disclosure footers per entity.',
      },
      {
        title: 'Secure sharing',
        description: 'Limit downloads with expiring links and OTP-protected report access.',
      },
    ],
  },
  {
    id: 'advanced-analytics',
    title: 'Advanced Analytics Workspace',
    icon: BarChart3,
    premiumBenefit:
      'Blend cash flow, liabilities, and investments into cohort analytics with variance analysis across time and category.',
    standardFeature: 'Static charts for balances and spending by category.',
    visual:
      'Analytics workspace featuring timeline decomposition, waterfall charts, and variance tables per category.',
    risk: {
      label: 'Requires clean data',
      description: 'Forecast accuracy depends on reconciled transactions and confirmed balances.',
      tone: 'medium',
    },
    scenarios: [
      {
        label: 'Quarterly review',
        description: 'Evaluates how expense drivers shifted quarter-over-quarter and recommends adjustments.',
        tone: 'positive',
      },
      {
        label: 'Budget overrun',
        description: 'Pinpoints which category caused overspend and the downstream impact on goals.',
        tone: 'caution',
      },
      {
        label: 'Team collaboration',
        description: 'Share curated dashboards with managers while keeping raw data masked.',
        tone: 'neutral',
      },
    ],
    highlights: [
      {
        title: 'Drill-down queries',
        description: 'Pivot by merchant, project, or card to uncover the story behind outliers.',
      },
      {
        title: 'Saved views',
        description: 'Bookmark dashboard layouts for recurring reviews and stakeholder briefs.',
      },
      {
        title: 'Data lineage',
        description: 'Track how each metric was calculated, from raw transaction through aggregation.',
      },
    ],
  },
  {
    id: 'debt-optimizer',
    title: 'Dynamic Debt Optimizer',
    icon: TrendingUp,
    premiumBenefit:
      'Prioritize payoff order dynamically with interest tracking, introductory rate monitoring, and refinance watchlists.',
    standardFeature: 'Manual snowball and avalanche calculators without automatic rate adjustments.',
    visual:
      'Timeline showing payoff milestones, cumulative interest saved, and recommended next actions.',
    risk: {
      label: 'Rate shifts',
      description: 'Planner adapts to teaser rate expirations and variable APR changes.',
      tone: 'medium',
    },
    scenarios: [
      {
        label: 'Bonus applied',
        description: 'Demonstrates how a one-time cash injection advances your debt-free date.',
        tone: 'positive',
      },
      {
        label: 'Cash crunch',
        description: 'Suggests minimum viable payments to stay current without penalties.',
        tone: 'neutral',
      },
      {
        label: 'Rate change alert',
        description: 'Escalates when a promo rate is about to expire and recommends refinancing options.',
        tone: 'caution',
      },
    ],
    highlights: [
      {
        title: 'Intro rate tracker',
        description: 'Monitor promotional APRs across every loan and credit card automatically.',
      },
      {
        title: 'Refinance suggestions',
        description: 'Compare refinance opportunities with net savings and break-even timelines.',
      },
      {
        title: 'Payment calendar sync',
        description: 'Sync payoff schedules into shared calendars with reminder nudges.',
      },
    ],
  },
];

const getRiskBadge = (tone: RiskTone) => {
  switch (tone) {
    case 'low':
      return 'bg-emerald-500/10 border border-emerald-400/30 text-emerald-200';
    case 'medium':
      return 'bg-amber-500/10 border border-amber-400/30 text-amber-200';
    case 'mixed':
      return 'bg-sky-500/10 border border-sky-400/30 text-sky-200';
    default:
      return 'bg-white/10 border border-white/20 text-white';
  }
};

const getScenarioStyle = (tone: ScenarioTone) => {
  switch (tone) {
    case 'positive':
      return 'border border-emerald-400/30 bg-emerald-500/10 text-emerald-100';
    case 'neutral':
      return 'border border-sky-400/30 bg-sky-500/10 text-sky-100';
    case 'caution':
      return 'border border-amber-400/30 bg-amber-500/10 text-amber-100';
    default:
      return 'border border-white/10 bg-white/5 text-white';
  }
};

const formatFeatureName = (feature: LicenseFeatureKey): string =>
  licenseFeatureLabels[feature] ?? feature;

const PremiumFeaturesPage: React.FC = () => {
  const { features, getUpgradeMessage, effectiveTier, appliedTier } = useLicenseGating();
  const featureEntries = Object.entries(features) as [LicenseFeatureKey, boolean][];
  const lockedFeatures = featureEntries
    .filter(([, enabled]) => !enabled)
    .map(([key]) => key);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 rounded-3xl overflow-hidden shadow-xl">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl" aria-hidden />
        <div className="relative px-6 py-16 text-center">
          <div className="mx-auto max-w-4xl space-y-6">
            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
              <Crown className="w-10 h-10 text-white" />
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Elevate Your Financial Journey with OwnCent Premium
            </h1>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto">
              Unlock advanced tools, personalized insights, and real-time data syncing so every decision feels deliberate, informed, and confident.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-20">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="grid gap-4 md:grid-cols-2 text-left text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-200/80">Your plan</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {tierDisplay[effectiveTier]}
              </p>
              <p className="mt-1 text-xs text-purple-200/70">
                Instance license tier: {tierDisplay[appliedTier]}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-200/80">Locked capabilities</p>
              {lockedFeatures.length === 0 ? (
                <p className="mt-2 text-sm text-emerald-200">All premium capabilities are unlocked for your session.</p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm text-rose-200">
                  {lockedFeatures.map((feature) => (
                    <li key={feature}>{formatFeatureName(feature)}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {premiumFeatureSections.map((section) => {
            const IconComponent = section.icon;
            const riskBadge = getRiskBadge(section.risk.tone);
            const featureKey = sectionFeatureKeyMap[section.id];
            const unlocked = featureKey ? features[featureKey] : false;
            const upgradeMessage = featureKey ? getUpgradeMessage(featureKey) : null;
            const statusBadgeClass = unlocked
              ? 'inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-4 py-1 text-xs font-semibold text-emerald-100'
              : 'inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/20 px-4 py-1 text-xs font-semibold text-rose-100';

            return (
              <section
                key={section.id}
                className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-white/5 backdrop-blur-lg shadow-xl shadow-purple-900/20"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-purple-900/10 to-indigo-900/20 opacity-80"
                  aria-hidden
                />
                <div className="relative p-8 md:p-10 space-y-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg shadow-purple-700/40">
                        <IconComponent className="h-7 w-7 text-white" />
                      </span>
                      <div>
                        <h2 className="text-2xl font-semibold text-white md:text-3xl">
                          {section.title}
                        </h2>
                        <p className="mt-1 text-sm text-purple-200/80">
                          Premium Benefit and comparative experience
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={[
                        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide',
                        riskBadge,
                      ].join(' ')}>
                        Risk Assessment: {section.risk.label}
                      </span>
                      {featureKey && (
                        <span className={statusBadgeClass}>
                          {unlocked ? 'Included in your plan' : 'Upgrade required'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-purple-200/80">Premium Experience</h3>
                        <p className="mt-3 text-sm leading-relaxed text-purple-100">
                          {section.premiumBenefit}
                        </p>
                        {featureKey && (
                          <p className={`mt-4 text-xs font-semibold ${unlocked ? 'text-emerald-200' : 'text-rose-200'}`}>
                            {unlocked
                              ? 'Unlocked via your current session tier.'
                              : upgradeMessage}
                          </p>
                        )}
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-purple-200/80">Standard Experience</h3>
                        <p className="mt-3 text-sm leading-relaxed text-purple-200/80">
                          {section.standardFeature}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-purple-200/80">Visualization</h3>
                      <p className="mt-3 text-sm leading-relaxed text-purple-100/80">
                        {section.visual}
                      </p>
                    </div>
                  </div>

                  {section.scenarios && (
                    <div className="grid gap-4 md:grid-cols-3">
                      {section.scenarios.map((scenario) => {
                        const scenarioStyle = getScenarioStyle(scenario.tone);
                        return (
                          <div
                            key={section.id + scenario.label}
                            className={['rounded-2xl p-4 shadow-inner shadow-black/10', scenarioStyle].join(' ')}
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide">
                              {scenario.label}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed">
                              {scenario.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {section.highlights && (
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-5">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-purple-200/80">
                        What Sets It Apart
                      </h3>
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        {section.highlights.map((highlight) => (
                          <div
                            key={section.id + highlight.title}
                            className="rounded-xl border border-white/10 bg-white/5 p-4"
                          >
                            <p className="text-sm font-semibold text-white">
                              {highlight.title}
                            </p>
                            <p className="mt-2 text-xs text-purple-200/80">
                              {highlight.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
      <div className="px-6 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-10 shadow-2xl shadow-purple-900/40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" aria-hidden />
            <div className="relative space-y-6">
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Experience the future of financial planning
              </h2>
              <p className="text-lg text-purple-100">
                Try OwnCent Premium free for 7 days, then choose the plan that fits: monthly at $9.99 or annual at $99. Upgrade when you are ready—cancel anytime with a single click.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-purple-800 shadow-lg shadow-purple-900/30 transition-transform hover:scale-105 hover:shadow-xl hover:shadow-purple-900/40">
                  Start Your Free Trial
                </button>
              </div>
              <p className="text-xs text-purple-200/80">
                Free trial available to new subscribers only. Cancel before day 7 to avoid charges. Synced accounts use bank-level encryption. During the trial, certain high-volume features may be limited to prevent abuse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeaturesPage;