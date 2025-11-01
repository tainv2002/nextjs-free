"use client";
import authApiRequests from "@/apiRequests/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

function LogoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionToken = searchParams.get("sessionToken");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const handleLogout = async () => {
      try {
        await authApiRequests.logoutFromNextClientToNextServer(true, signal);
      } catch (error) {
        // handleErrorApi(error);
      } finally {
        router.replace("/login");
      }
    };

    const sessionTokenFromStorage = localStorage.getItem("sessionToken");

    if (sessionToken === sessionTokenFromStorage) {
      handleLogout();
    }

    return () => {
      controller.abort();
    };
  }, [router, sessionToken]);

  return <div>Logging out...</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LogoutContent />
    </Suspense>
  );
}
