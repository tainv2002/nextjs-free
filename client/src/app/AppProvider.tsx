"use client";

import { clientSessionToken } from "@/lib/http";
import React, { useState } from "react";

type AppProviderProps = {
  children: React.ReactNode;
  initialSessionToken?: string;
};

export const AppProvider = ({
  children,
  initialSessionToken = "",
}: AppProviderProps) => {
  useState(() => {
    if (typeof window === "undefined") return;
    clientSessionToken.value = initialSessionToken;
  });

  return <>{children}</>;
};
