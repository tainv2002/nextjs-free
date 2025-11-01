"use client";

import { AccountResType } from "@/schemaValidations/account.schema";
import React, { createContext, useContext, useState } from "react";

type AppContextType = {
  user: AccountResType["data"] | null;
  setUser: (user: AccountResType["data"] | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

type AppProviderProps = {
  children: React.ReactNode;
  user: AccountResType["data"] | null;
};

export const AppProvider = ({
  children,
  user: initialUser = null,
}: AppProviderProps) => {
  const [user, setUser] = useState<AccountResType["data"] | null>(initialUser);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
