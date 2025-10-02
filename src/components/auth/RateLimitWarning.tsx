import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Shield } from 'lucide-react';

interface RateLimitWarningProps {
  identifier: string;
  maxAttempts?: number;
  windowMs?: number;
  onLimitExceeded?: () => void;
}

interface RateLimitInfo {
  allowed: boolean;
  remainingAttempts: number;
  resetTime?: number;
}

const RateLimitWarning: React.FC<RateLimitWarningProps> = ({
  identifier,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000, // 15 minutes
  onLimitExceeded
}) => {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState<number>(0);

  useEffect(() => {
    const checkRateLimit = async () => {
      try {
        const response = await fetch(`/api/auth/rate-limit/${encodeURIComponent(identifier)}`, {
          headers: {
            'X-Tenant-ID': 'demo-instance'
          }
        });
        
        if (response.ok) {
          const info: RateLimitInfo = await response.json();
          setRateLimitInfo(info);
          
          if (!info.allowed && info.resetTime) {
            setTimeUntilReset(Math.max(0, info.resetTime - Date.now()));
            if (onLimitExceeded) {
              onLimitExceeded();
            }
          }
        }
      } catch (error) {
        console.warn('Failed to check rate limit:', error);
      }
    };

    if (identifier) {
      checkRateLimit();
    }
  }, [identifier, onLimitExceeded]);

  // Update countdown timer
  useEffect(() => {
    if (timeUntilReset > 0) {
      const timer = setInterval(() => {
        setTimeUntilReset(prev => {
          const newTime = Math.max(0, prev - 1000);
          if (newTime === 0) {
            // Rate limit has expired, refresh the info
            setRateLimitInfo(null);
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeUntilReset]);

  if (!rateLimitInfo) {
    return null;
  }

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Show warning when approaching limit
  if (rateLimitInfo.allowed && rateLimitInfo.remainingAttempts <= 2) {
    return (
      <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
        <AlertTriangle className="h-4 w-4" />
        <div className="text-sm">
          <p className="font-medium">Security Warning</p>
          <p>
            {rateLimitInfo.remainingAttempts} attempt{rateLimitInfo.remainingAttempts !== 1 ? 's' : ''} remaining 
            before temporary lockout
          </p>
        </div>
      </div>
    );
  }

  // Show lockout message
  if (!rateLimitInfo.allowed) {
    return (
      <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
        <Shield className="h-4 w-4" />
        <div className="text-sm">
          <p className="font-medium">Account Temporarily Locked</p>
          <div className="flex items-center space-x-2 mt-1">
            <Clock className="h-3 w-3" />
            <p>
              Too many failed attempts. Try again in {formatTimeRemaining(timeUntilReset)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RateLimitWarning;