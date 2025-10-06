import React, { useState } from "react";
import { TrendingUp, TrendingDown, Star, Plus, Filter } from "lucide-react";
import MetricCard from "./common/MetricCard";
import PieChart from "./charts/PieChart";
import Table from "./common/Table";
import { useLicenseGating } from "../hooks/useLicenseGating";

const InvestmentsPage = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const { canUseAdvancedAnalytics } = useLicenseGating();

  const investmentMetrics = [
    {
      title: "Total Investment",
      value: "$24,890.45",
      change: "+12.4%",
      trend: "up",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Total Gains",
      value: "+$2,890.45",
      change: "+15.2%",
      trend: "up",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Total Losses",
      value: "-$340.20",
      change: "-2.1%",
      trend: "down",
      icon: TrendingDown,
      color: "red",
    },
    {
      title: "Net Return",
      value: "+$2,550.25",
      change: "+11.4%",
      trend: "up",
      icon: TrendingUp,
      color: "blue",
    },
  ];

  const allocationData = [
    { name: "Stocks", value: 12500, color: "#3b82f6", percentage: 50.2 },
    { name: "Bonds", value: 4980, color: "#10b981", percentage: 20.0 },
    { name: "Cryptocurrency", value: 3735, color: "#f59e0b", percentage: 15.0 },
    { name: "Gold", value: 1867, color: "#eab308", percentage: 7.5 },
    { name: "Real Estate", value: 1244, color: "#8b5cf6", percentage: 5.0 },
    { name: "Collectibles", value: 564, color: "#ec4899", percentage: 2.3 },
  ];

  const recentTransactions = [
    {
      id: 1,
      date: "2024-01-12",
      type: "Buy",
      asset: "AAPL",
      description: "Apple Inc.",
      quantity: 10,
      price: 185.5,
      amount: 1855.0,
      category: "Stocks",
    },
    {
      id: 2,
      date: "2024-01-10",
      type: "Sell",
      asset: "BTC",
      description: "Bitcoin",
      quantity: 0.05,
      price: 42000.0,
      amount: -2100.0,
      category: "Cryptocurrency",
    },
    {
      id: 3,
      date: "2024-01-08",
      type: "Buy",
      asset: "VTIAX",
      description: "Vanguard Total Intl Stock",
      quantity: 50,
      price: 28.4,
      amount: 1420.0,
      category: "Bonds",
    },
    {
      id: 4,
      date: "2024-01-05",
      type: "Dividend",
      asset: "VOO",
      description: "Vanguard S&P 500 ETF",
      quantity: 25,
      price: 4.2,
      amount: 105.0,
      category: "Stocks",
    },
    {
      id: 5,
      date: "2024-01-03",
      type: "Buy",
      asset: "GLD",
      description: "SPDR Gold Trust",
      quantity: 5,
      price: 186.75,
      amount: 933.75,
      category: "Gold",
    },
  ];

  const transactionColumns = [
    { key: "date", header: "Date", sortable: true },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            value === "Buy"
              ? "bg-green-100 text-green-800"
              : value === "Sell"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: "asset", header: "Symbol", sortable: true },
    { key: "description", header: "Description", sortable: true },
    { key: "category", header: "Category", sortable: true },
    {
      key: "quantity",
      header: "Quantity",
      sortable: true,
      render: (value) => value.toFixed(2),
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (value) => (
        <span
          className={
            value > 0
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {value > 0 ? "+" : ""}${Math.abs(value).toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Investment Portfolio
        </h1>
        <p className="text-gray-600">
          Track your investment performance and allocation
        </p>
      </div>

      {/* Investment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {investmentMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Portfolio Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Asset Allocation
          </h3>
          <div className="flex items-center justify-center">
            <PieChart data={allocationData} size={280} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Allocation Breakdown
          </h3>
          <div className="space-y-3">
            {allocationData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ${item.value.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Analytics (Premium Feature) */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-200 p-6 text-purple-900 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-purple-900">
              Advanced Analytics
            </h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-white text-purple-700">
              PREMIUM
            </span>
          </div>
        </div>
        {canUseAdvancedAnalytics ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Sharpe Ratio</h4>
              <p className="text-2xl font-bold text-blue-600">1.42</p>
              <p className="text-sm text-gray-600">Risk-adjusted return</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Beta</h4>
              <p className="text-2xl font-bold text-purple-600">0.89</p>
              <p className="text-sm text-gray-600">Market correlation</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Volatility</h4>
              <p className="text-2xl font-bold text-orange-600">14.2%</p>
              <p className="text-sm text-gray-600">Standard deviation</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Max Drawdown</h4>
              <p className="text-2xl font-bold text-red-600">-8.5%</p>
              <p className="text-sm text-gray-600">Largest loss</p>
            </div>
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-4 border border-purple-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-24 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded animate-pulse w-16 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-32"></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!canUseAdvancedAnalytics && (
          <>
            <p className="mb-4 text-purple-800">
              Unlock advanced portfolio analytics including Sharpe ratio, Beta, volatility metrics, and drawdown analysis.
            </p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Upgrade to Premium
            </button>
          </>
        )}
      </div>

      {/* Benchmark Comparison (Premium Feature) */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-200 p-6 text-purple-900 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-purple-900">
              Portfolio vs Benchmarks
            </h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-white text-purple-700">
              PREMIUM
            </span>
          </div>
        </div>
        {canUseAdvancedAnalytics ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg bg-white">
              <h4 className="font-semibold text-gray-900 mb-2">Your Portfolio</h4>
              <p className="text-3xl font-bold text-green-600">+11.4%</p>
              <p className="text-sm text-gray-600">YTD Return</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg bg-white">
              <h4 className="font-semibold text-gray-900 mb-2">S&P 500</h4>
              <p className="text-3xl font-bold text-blue-600">+9.8%</p>
              <p className="text-sm text-gray-600">YTD Return</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg bg-white">
              <h4 className="font-semibold text-gray-900 mb-2">Outperformance</h4>
              <p className="text-3xl font-bold text-green-600">+1.6%</p>
              <p className="text-sm text-gray-600">vs S&P 500</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-4 border border-purple-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="text-center p-4 bg-gray-100 rounded-lg border border-gray-200">
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-32 mx-auto mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded animate-pulse w-20 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded animate-pulse w-24 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mb-4 text-purple-800">
              Compare your portfolio performance against major market benchmarks like S&P 500, NASDAQ, and custom indices.
            </p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Upgrade to Premium
            </button>
          </>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Investment Transactions
            </h3>
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </button>
            </div>
          </div>
        </div>
        <Table
          data={recentTransactions}
          columns={transactionColumns}
          sortConfig={sortConfig}
          onSort={setSortConfig}
        />
      </div>
    </div>
  );
};

export default InvestmentsPage;

