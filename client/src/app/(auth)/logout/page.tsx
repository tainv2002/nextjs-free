"use client";
import authApiRequests from "@/apiRequests/auth";
import { clientSessionToken } from "@/lib/http";
import { handleErrorApi } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
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

    if (sessionToken === clientSessionToken.value) {
      handleLogout();
    }

    return () => {
      controller.abort();
    };
  }, [router, sessionToken]);

  return <div>Page</div>;
}
