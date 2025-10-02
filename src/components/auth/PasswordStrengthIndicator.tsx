import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  className = '' 
}) => {
  const calculateStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      longLength: password.length >= 12
    };

    // Calculate score
    Object.values(checks).forEach(check => {
      if (check) score += 1;
    });

    // Penalty for common patterns
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /admin/i,
      /letmein/i
    ];

    if (commonPatterns.some(pattern => pattern.test(password))) {
      score = Math.max(0, score - 2);
    }

    return { score: Math.min(score, 6), checks };
  };

  if (!password) {
    return null;
  }

  const { score, checks } = calculateStrength(password);
  
  const getStrengthLevel = (score: number) => {
    if (score <= 2) return { level: 'weak', color: 'red', icon: ShieldX };
    if (score <= 3) return { level: 'fair', color: 'yellow', icon: ShieldAlert };
    if (score <= 4) return { level: 'good', color: 'blue', icon: Shield };
    return { level: 'strong', color: 'green', icon: ShieldCheck };
  };

  const strength = getStrengthLevel(score);
  const StrengthIcon = strength.icon;

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-600 bg-red-50 border-red-200';
      case 'yellow': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'blue': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'green': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`p-3 border rounded-lg ${getColorClasses(strength.color)} ${className}`}>
      <div className="flex items-center space-x-2 mb-2">
        <StrengthIcon className="h-4 w-4" />
        <span className="text-sm font-medium capitalize">
          Password Strength: {strength.level}
        </span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              strength.color === 'red' ? 'bg-red-500' :
              strength.color === 'yellow' ? 'bg-yellow-500' :
              strength.color === 'blue' ? 'bg-blue-500' :
              'bg-green-500'
            }`}
            style={{ width: `${(score / 6) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className={`flex items-center space-x-1 ${checks.length ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{checks.length ? '✓' : '○'}</span>
          <span>8+ characters</span>
        </div>
        <div className={`flex items-center space-x-1 ${checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{checks.lowercase ? '✓' : '○'}</span>
          <span>Lowercase</span>
        </div>
        <div className={`flex items-center space-x-1 ${checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{checks.uppercase ? '✓' : '○'}</span>
          <span>Uppercase</span>
        </div>
        <div className={`flex items-center space-x-1 ${checks.numbers ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{checks.numbers ? '✓' : '○'}</span>
          <span>Numbers</span>
        </div>
        <div className={`flex items-center space-x-1 ${checks.special ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{checks.special ? '✓' : '○'}</span>
          <span>Special chars</span>
        </div>
        <div className={`flex items-center space-x-1 ${checks.longLength ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{checks.longLength ? '✓' : '○'}</span>
          <span>12+ chars</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;