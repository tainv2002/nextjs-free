import Profile from "@/app/me/Profile";
import envConfig from "@/config";
import { cookies } from "next/headers";
import React from "react";

export default async function Page() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value ?? "";

  const result = await fetch(
    `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
        sessionToken: sessionToken,
      },
      method: "GET",
    }
  ).then(async (res) => {
    const payload = await res.json();
    const data = {
      status: res.status,
      payload,
    };
    if (!res.ok) {
      throw data;
    }
    return data;
  });

  return (
    <div>
      <h1>Welcome {result.payload.data.name}</h1>

      <Profile />
    </div>
  );
}
