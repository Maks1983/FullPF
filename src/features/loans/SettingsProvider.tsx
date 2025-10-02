import React, { createContext, useContext, ReactNode } from "react";
import type { Currency } from "./types";
import { useDefaultCurrency, getDefaultCurrency } from "../../hooks/useDefaultCurrency";

type LoanSettings = {
  defaultCurrency: Currency;
};

const LoanSettingsContext = createContext<LoanSettings | undefined>(undefined);

interface LoanSettingsProviderProps {
  children: ReactNode;
}

export const LoanSettingsProvider: React.FC<LoanSettingsProviderProps> = ({ children }) => {
  const defaultCurrency = useDefaultCurrency();
  const value: LoanSettings = { defaultCurrency };

  return (
    <LoanSettingsContext.Provider value={value}>
      {children}
    </LoanSettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(LoanSettingsContext);
  if (context) {
    return { settings: context };
  }

  return {
    settings: {
      defaultCurrency: getDefaultCurrency(),
    },
  };
};
