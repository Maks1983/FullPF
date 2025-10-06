import React, { useState } from "react";
import {
  Crown,
  PiggyBank,
  CreditCard,
  TrendingUp,
  Building,
  Scale,
  Wallet,
  Home,
  Calendar,
  Menu,
  X,
  Settings,
  Target,
  Zap,
  Sparkles,
  User,
  LogOut,
  Lock,
  LogIn,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import DashboardPage from "./components/DashboardPage";
import CurrentPage from "./components/CurrentPage";
import SavingsPage from "./components/SavingsPage";
import DebtsPage from "./components/DebtsPage";
import InvestmentsPage from "./components/InvestmentsPage";
import AssetsPage from "./components/AssetsPage";
import LiabilitiesPage from "./components/LiabilitiesPage";
import NetWorthPage from "./components/NetWorthPage";
import SettingsPage from "./components/SettingsPage";
import { DebtOptimizer } from "./features/debtOptimizer/DebtOptimizer.tsx";
import PremiumFeaturesPage from "./features/premium/PremiumFeaturesPage";
import { StrategySimulator } from "./features/debtOptimizer/StrategySimulator.tsx";
import AdminPanel from "./components/admin/AdminPanel";
import { useAuthContext } from "./context/AuthContext";
import type { FeatureFlagKey } from "./context/AdminFoundation";

type NavigationItem = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "premium";
  premium?: boolean;
  featureFlag?: FeatureFlagKey;
  roles?: Array<"owner" | "manager" | "user" | "family" | "readonly">;
};

const tierLabels: Record<string, string> = {
  free: "Free",
  advanced: "Advanced",
  premium: "Premium",
  family: "Family",
};

const navigation: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: Home },
  { id: "current", name: "Current", icon: Calendar },
  { id: "savings", name: "Savings", icon: PiggyBank },
  { id: "debts", name: "Debts", icon: CreditCard },
  { id: "investments", name: "Investments", icon: TrendingUp },
  { id: "assets", name: "Assets", icon: Building },
  { id: "liabilities", name: "Liabilities", icon: Scale },
  { id: "networth", name: "Net Worth", icon: Wallet },
  { id: "premium-features", name: "Premium Features", icon: Crown, variant: "premium" },
  {
    id: "debt-optimizer",
    name: "Debt Optimizer",
    icon: Target,
    premium: true,
    featureFlag: "debt_optimizer_enabled",
  },
  {
    id: "strategy",
    name: "Strategy Simulator",
    icon: Zap,
    premium: true,
    featureFlag: "strategy_simulator_enabled",
  },
  {
    id: "admin",
    name: "Admin Panel",
    icon: ShieldCheck,
    roles: ["owner", "manager"],
  },
  { id: "settings", name: "Settings", icon: Settings },
];

const renderPremiumPlaceholder = (feature: string) => (
  <div className="bg-white border border-blue-200 rounded-xl p-10 text-center space-y-4">
    <Sparkles className="w-10 h-10 text-blue-500 mx-auto" />
    <h2 className="text-xl font-semibold text-gray-900">
      {feature} is a premium feature
    </h2>
    <p className="text-gray-600 text-sm max-w-xl mx-auto">
      Upgrade your plan to unlock advanced debt optimization tools including{" "}
      {feature.toLowerCase()}.
    </p>
  </div>
);

function App() {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const {
    session,
    effectiveSession,
    impersonation,
    login,
    logout,
    featureAvailability
  } = useAuthContext();
  const [loginError, setLoginError] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = Boolean(session);
  const allowedNavigation = navigation.filter((item) => {
    if (item.roles && (!session || !item.roles.includes(session.role))) {
      return false;
    }
    return true;
  });

  const handleLoginChange =
    (field: "username" | "password") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLoginForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      if (loginError) {
        setLoginError("");
      }
    };

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await login(loginForm.username, loginForm.password);
    if (result.success) {
      setLoginError("");
      setLoginForm({ username: "", password: "" });
      setCurrentPage(["owner", "manager"].includes(result.session.role) ? "admin" : "dashboard");
      setMobileMenuOpen(false);
    } else {
      setLoginError(result.error);
    }
  };

  const handleLogout = () => {
    logout();
    setLoginForm({ username: "", password: "" });
    setLoginError("");
    setCurrentPage("dashboard");
    setMobileMenuOpen(false);
  };

  const renderFeaturePage = (
    Component: React.ComponentType,
    featureFlag: FeatureFlagKey,
    featureName: string,
  ) => {
    return featureAvailability(featureFlag)
      ? <Component />
      : renderPremiumPlaceholder(featureName);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "current":
        return <CurrentPage />;
      case "savings":
        return <SavingsPage />;
      case "debts":
        return <DebtsPage />;
      case "investments":
        return <InvestmentsPage />;
      case "assets":
        return <AssetsPage />;
      case "liabilities":
        return <LiabilitiesPage />;
      case "networth":
        return <NetWorthPage />;
      case "premium-features":
        return <PremiumFeaturesPage />;
      case "debt-optimizer":
        return renderFeaturePage(DebtOptimizer, "debt_optimizer_enabled", "Debt Optimizer");
      case "strategy":
        return renderFeaturePage(StrategySimulator, "strategy_simulator_enabled", "Strategy Simulator");
      case "admin":
        return <AdminPanel />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 flex items-center justify-center px-6">
          <div className="max-w-5xl w-full grid gap-6 md:grid-cols-[1.2fr_1fr] items-stretch">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-10 text-white shadow-2xl">
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_60%)]"
                aria-hidden
              />
              <div className="relative space-y-6">
                <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  <span>Welcome to OwnCent Premium</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
                  Own every cent with clarity and confidence
                </h1>
                <p className="text-purple-100 text-sm md:text-base leading-relaxed">
                  Sign in with the demo credentials to explore the full personal
                  finance workspace, premium automation tools, and analytics
                  without restrictions.
                </p>
                <ul className="space-y-3 text-sm text-purple-100/90">
                  <li className="flex items-start gap-3">
                    <ChevronRight className="mt-1 h-4 w-4" /> Smart insights
                    across spending, saving, and investments
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="mt-1 h-4 w-4" /> Debt Optimizer and
                    Strategy Simulator ready for experimentation
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="mt-1 h-4 w-4" /> All premium
                    visuals and reports available during the preview
                  </li>
                </ul>
                <div className="rounded-2xl bg-white/10 p-4 text-sm text-purple-100/90">
                  <p className="font-semibold">Demo credentials</p>
                  <p className="mt-1">
                    <span className="text-white">User:</span> demo
                  </p>
                  <p>
                    <span className="text-white">Pass:</span> demo
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-purple-100">
              <div className="mb-6 space-y-2 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-sm">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Sign in to continue
                </h2>
                <p className="text-sm text-gray-500">
                  Use the demo credentials and take OwnCent Premium for a spin.
                </p>
              </div>
              <form className="space-y-5" onSubmit={handleLoginSubmit}>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      type="text"
                      value={loginForm.username}
                      onChange={handleLoginChange("username")}
                      autoComplete="username"
                      placeholder="demo"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={handleLoginChange("password")}
                      autoComplete="current-password"
                      placeholder="demo"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </div>
                {loginError && (
                  <p className="text-sm font-medium text-rose-600">
                    {loginError}
                  </p>
                )}
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 text-white text-sm font-semibold shadow-lg shadow-purple-500/20 transition-transform hover:scale-[1.01]"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </button>
                <div className="text-xs text-gray-500 text-center space-y-1">
                  <p>Owner: admin / admin</p>
                  <p>Manager: manager / manager</p>
                  <p>Standard: demo / demo</p>
                </div>
              </form>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="md:hidden p-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-medium text-purple-700 shadow-sm hover:border-purple-300 hover:bg-purple-50"
          >
            {mobileMenuOpen ? (
              <>
                <X className="h-4 w-4" />
                Close Menu
              </>
            ) : (
              <>
                <Menu className="h-4 w-4" />
                Open Menu
              </>
            )}
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <nav
            className={`${mobileMenuOpen ? "flex" : "hidden"} md:flex w-full md:w-64 bg-white shadow-sm flex-col md:sticky md:top-0 md:h-screen`}
          >
            <div className="flex h-full w-full flex-col">
              <div className="flex-1 p-4 space-y-5 overflow-y-auto md:pr-1">
                <div className="rounded-2xl p-4 text-black">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-14 w-48 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                      <img
                        src="/branding/splash-screens/Big_OwnCent_Splash.png"
                        alt="OwnCent logo"
                        className="h-14 w-30"
                      />
                    </span>
                  </div>
                </div>

                <ul className="space-y-1">
                  {allowedNavigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    const isPremium = Boolean(item.premium);
                    const isPremiumLanding = item.variant === "premium" || item.id === "premium-features";
                    const featureFlag = item.featureFlag as ("debt_optimizer_enabled" | "strategy_simulator_enabled" | undefined);
                    const featureUnlocked = featureFlag ? featureAvailability(featureFlag) : true;
                    const locked = isPremium && !featureUnlocked;

                    const baseButtonClass =
                      "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all border";
                    const premiumLandingActiveClass =
                      "bg-gradient-to-r from-purple-500 via-purple-500 to-pink-500 text-white border-purple-300 shadow-md";
                    const premiumLandingInactiveClass =
                      "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200 shadow-sm";
                    const premiumFeatureActiveClass =
                      "bg-gray-100 text-purple-700 border-transparent shadow-sm";
                    const premiumFeatureInactiveClass =
                      "bg-white text-purple-700 border-transparent hover:bg-gray-50";
                    const premiumFeatureLockedClass =
                      "bg-white text-purple-600 border-transparent hover:bg-purple-50";
                    const defaultActiveClass =
                      "bg-gray-100 text-gray-900 border-gray-200 shadow-sm";
                    const defaultInactiveClass =
                      "text-gray-600 border-transparent hover:border-gray-200 hover:bg-gray-50";

                    let buttonClassName;
                    if (isPremiumLanding) {
                      buttonClassName = `${baseButtonClass} ${
                        isActive
                          ? premiumLandingActiveClass
                          : premiumLandingInactiveClass
                      }`;
                    } else if (isPremium) {
                      if (locked) {
                        buttonClassName = `${baseButtonClass} ${premiumFeatureLockedClass}`;
                      } else if (isActive) {
                        buttonClassName = `${baseButtonClass} ${premiumFeatureActiveClass}`;
                      } else {
                        buttonClassName = `${baseButtonClass} ${premiumFeatureInactiveClass}`;
                      }
                    } else if (isActive) {
                      buttonClassName = `${baseButtonClass} ${defaultActiveClass}`;
                    } else {
                      buttonClassName = `${baseButtonClass} ${defaultInactiveClass}`;
                    }

                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            setCurrentPage(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={buttonClassName}
                        >
                          <span
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${
                              isPremiumLanding
                                ? isActive
                                  ? "bg-white text-purple-700 shadow-sm"
                                  : "bg-purple-50 text-purple-600"
                                : isPremium
                                  ? locked
                                    ? "bg-white text-purple-600"
                                    : isActive
                                      ? "bg-white text-purple-700 shadow-sm"
                                      : "bg-white text-purple-700"
                                  : isActive
                                    ? "bg-gray-200 text-gray-900"
                                    : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="flex-1 text-left">{item.name}</span>
                          {isPremiumLanding && (
                            <span
                              className={`h-2 w-2 rounded-full ${isActive ? "bg-purple-600" : "bg-purple-300"}`}
                            />
                          )}
                          {isPremiumLanding
                            ? null
                            : locked && (
                                <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                                  PREMIUM
                                </span>
                              )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium text-sm">
                      {session?.displayName ?? session?.username ?? "—"}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {impersonation
                        ? `Impersonating ${impersonation.target.displayName}`
                        : effectiveSession
                          ? `${tierLabels[effectiveSession.tier]} tier`
                          : "Session inactive"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1 p-6 space-y-4">
            {impersonation && (
              <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  You are impersonating <strong>{impersonation.target.displayName}</strong>. Actions respect their permissions.
                </span>
              </div>
            )}
            {renderPage()}
          </main>
        </div>
      </div>
  );
}

export default App;
