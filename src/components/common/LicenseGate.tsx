import React from 'react';
import { Star } from 'lucide-react';

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
    <div className={`bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="h-6 w-6 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">{featureName}</h3>
          <span className="ml-2 px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">PREMIUM</span>
        </div>
      </div>
      
      {/* Mock content area to show what the feature would contain */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-4 border border-purple-100">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{upgradeMessage}</p>
      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
        Upgrade to Premium
      </button>
    </div>
  );
};

export default LicenseGate;