export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
  };
  api: {
    baseUrl: string;
    version: string;
  };
  tenant: {
    id: string;
    name: string;
    confirmationToken: string;
  };
  features: {
    enableBankIntegration: boolean;
    enablePremiumFeatures: boolean;
    enableAnalytics: boolean;
  };
  security: {
    stepUpCode: string;
    stepUpValidWindowMs: number;
  };
  admin: {
    maxTenants: number;
    tenantIdMinLength: number;
    tenantIdMaxLength: number;
  };
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] ?? defaultValue ?? '';
  }
  return defaultValue ?? '';
};

const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = getEnvVar(key);
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

export const appConfig: AppConfig = {
  app: {
    name: 'OwnCent',
    version: '1.0.0',
    environment: (getEnvVar('VITE_APP_ENV', 'development') as AppConfig['app']['environment']),
  },
  api: {
    baseUrl: getEnvVar('VITE_API_URL', 'http://localhost:4000/api/v1'),
    version: 'v1',
  },
  tenant: {
    id: getEnvVar('VITE_TENANT_ID', 'demo-instance').toLowerCase(),
    name: getEnvVar('VITE_TENANT_NAME', 'OwnCent Demo Instance'),
    confirmationToken: getEnvVar('VITE_TENANT_CONFIRMATION_TOKEN', 'owncent-demo'),
  },
  features: {
    enableBankIntegration: getEnvBoolean('VITE_ENABLE_BANK_INTEGRATION', false),
    enablePremiumFeatures: getEnvBoolean('VITE_ENABLE_PREMIUM_FEATURES', true),
    enableAnalytics: getEnvBoolean('VITE_ENABLE_ANALYTICS', false),
  },
  security: {
    stepUpCode: '246810',
    stepUpValidWindowMs: 5 * 60 * 1000,
  },
  admin: {
    maxTenants: 10,
    tenantIdMinLength: 3,
    tenantIdMaxLength: 50,
  },
};

export default appConfig;