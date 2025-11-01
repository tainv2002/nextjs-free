"use client";
import accountApiRequest from "@/apiRequests/account";
import React, { useEffect } from "react";

export default function Profile() {
  useEffect(() => {
    const getMe = async () => {
      const result = await accountApiRequest.meClient();
    };

    getMe();
  }, []);

  return <div>Profile</div>;
}
