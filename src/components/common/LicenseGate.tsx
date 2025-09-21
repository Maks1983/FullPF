import React from 'react';
import { Lock, Star, ArrowRight } from 'lucide-react';

interface LicenseGateProps {
  isLicensed: boolean;
  featureName: string;
  upgradeMessage: string;
  children: React.ReactNode;
  className?: string;
}

const LicenseGate: React.FC<LicenseGateProps> = ({
  isLicensed,
  featureName,
  upgradeMessage,
  children,
  className = ''
}) => {
  if (isLicensed) {
    return <>{children}</>;
  }

  return (
    <div className={`bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Star className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{featureName}</h3>
            <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
              PREMIUM FEATURE
            </span>
          </div>
        </div>
        <Lock className="h-6 w-6 text-purple-400" />
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 mb-4 border border-purple-100">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {featureName} content is available with a premium license
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-700 mb-4">{upgradeMessage}</p>
        <button className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
          <Star className="h-4 w-4 mr-2" />
          Upgrade Now
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default LicenseGate;