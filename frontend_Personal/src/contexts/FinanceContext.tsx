import { createContext } from "react";

interface FinanceContextType {
  // Add your finance context properties here
}

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <FinanceContext.Provider value={undefined}>{children}</FinanceContext.Provider>;
};