import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "./AppProvider";
import { cookies } from "next/headers";
import accountApiRequest from "@/apiRequests/account";

const inter = Inter({ subsets: ["vietnamese"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Acme",
    default: "Acme", // a default is required when creating a template
  },
  description: "Được tạo bởi Tài Văn",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <AppProvider user={user}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
