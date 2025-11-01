"use client";
import authApiRequests from "@/apiRequests/auth";
import { Button } from "@/components/ui/button";
import { handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

export default function ButtonLogout() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await authApiRequests.logoutFromNextClientToNextServer();
      router.push("/login");
      localStorage.removeItem("sessionToken");
    } catch (error) {
      handleErrorApi(error);
    }
  };

  return (
    <Button size={"sm"} onClick={handleLogout}>
      Logout
    </Button>
  );
}
