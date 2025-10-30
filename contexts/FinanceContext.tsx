import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FinanceContextType {
  balance: number;
  setBalance: (balance: number) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(0);

  return (
    <FinanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
