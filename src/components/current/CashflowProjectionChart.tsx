import React, { useMemo } from 'react';
import { TrendingDown, AlertTriangle } from 'lucide-react';
import type { CashflowProjection } from '../../types/current';

interface CashflowProjectionChartProps {
  projections: CashflowProjection[];
  daysUntilDeficit: number;
}

const CHART_HEIGHT = 200;
const CHART_WIDTH = 600;
const MAX_VISIBLE_POINTS = 7;

const CashflowProjectionChart: React.FC<CashflowProjectionChartProps> = ({
  projections,
  daysUntilDeficit
}) => {
  const visibleProjections = useMemo(
    () => projections.slice(0, MAX_VISIBLE_POINTS),
    [projections]
  );

  const { maxBalance, minBalance } = useMemo(() => {
    if (visibleProjections.length === 0) {
      return { maxBalance: 0, minBalance: 0 };
    }

    const balances = visibleProjections.map(projection => projection.projectedBalance);
    return {
      maxBalance: Math.max(...balances),
      minBalance: Math.min(...balances),
    };
  }, [visibleProjections]);

  const hasDeficit = minBalance < 0;
  const range = maxBalance - minBalance || 1;

  const getY = (balance: number) => {
    return CHART_HEIGHT - ((balance - minBalance) / range) * CHART_HEIGHT;
  };

  if (visibleProjections.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Cashflow Projection</h3>
          <p className="text-sm text-gray-600">Connect your accounts to see upcoming cashflow</p>
        </div>
      </div>
    );
  }

  const buildPathData = () => {
    if (visibleProjections.length === 1) {
      const singleY = getY(visibleProjections[0].projectedBalance);
      return `M 0 ${singleY} L ${CHART_WIDTH} ${singleY}`;
    }

    return visibleProjections
      .map((projection, index) => {
        const x = (index / (visibleProjections.length - 1)) * CHART_WIDTH;
        const y = getY(projection.projectedBalance);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  const pathData = buildPathData();
  const firstProjection = visibleProjections[0];
  const lastProjection = visibleProjections[visibleProjections.length - 1];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">7-Day Cashflow Projection</h3>
              <p className="text-sm text-gray-600">Balance forecast with scheduled payments</p>
            </div>
          </div>
          {hasDeficit && (
            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span>Potential deficit in {daysUntilDeficit} days</span>
            </div>
          )}
        </div>

        <div className="relative mb-6" style={{ height: CHART_HEIGHT }}>
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="overflow-visible"
          >
            {minBalance < 0 && maxBalance > 0 && (
              <line
                x1="0"
                y1={getY(0)}
                x2={CHART_WIDTH}
                y2={getY(0)}
                stroke="#d1d5db"
                strokeWidth="2"
                strokeDasharray="4,4"
                opacity="0.5"
              />
            )}

            {visibleProjections.length > 1 && (
              <path
                d={`M 0 ${CHART_HEIGHT} ${pathData} L ${CHART_WIDTH} ${CHART_HEIGHT} Z`}
                fill={hasDeficit ? 'rgba(37, 99, 235, 0.12)' : 'rgba(37, 99, 235, 0.08)'}
              />
            )}

            <path
              d={pathData}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              className="drop-shadow-sm"
              strokeDasharray={hasDeficit ? '6,4' : undefined}
            />

            {visibleProjections.map((projection, index) => {
              const x = visibleProjections.length === 1
                ? CHART_WIDTH / 2
                : (index / (visibleProjections.length - 1)) * CHART_WIDTH;
              const y = getY(projection.projectedBalance);
              const isNegative = projection.projectedBalance < 0;

              return (
                <circle
                  key={`${projection.date}-${index}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={isNegative ? '#fca5a5' : '#2563eb'}
                  stroke="white"
                  strokeWidth="2"
                >
                  <title>
                    {`${new Date(projection.date).toLocaleDateString()}\nBalance: NOK ${projection.projectedBalance.toLocaleString()}\nNet flow: NOK ${projection.netFlow.toLocaleString()}`}
                  </title>
                </circle>
              );
            })}
          </svg>
        </div>

        <div className="flex justify-between text-xs text-gray-500 mb-4">
          {visibleProjections.map((projection, index) => (
            <span key={index} className="text-center">
              {new Date(projection.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              NOK {firstProjection.projectedBalance.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Current Balance</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              NOK {minBalance.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Lowest Point</p>
            {minBalance < 0 && (
              <p className="text-xs font-medium text-red-600">Review spending to avoid a shortfall</p>
            )}
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              NOK {lastProjection.projectedBalance.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">End of Period</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashflowProjectionChart;
