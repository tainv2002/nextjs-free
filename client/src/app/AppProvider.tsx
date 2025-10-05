"use client";

import React, { createContext, useContext, useState } from "react";

type AppContextType = {
  sessionToken: string;
  setSessionToken: (token: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

type AppProviderProps = {
  children: React.ReactNode;
  initialSessionToken?: string;
};

export const AppProvider = ({
  children,
  initialSessionToken = "",
}: AppProviderProps) => {
  const [sessionToken, setSessionToken] = useState<string>(initialSessionToken);

  return (
    <AppContext.Provider value={{ sessionToken, setSessionToken }}>
      {children}
    </AppContext.Provider>
  );
};
