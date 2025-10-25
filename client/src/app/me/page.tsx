import accountApiRequest from "@/apiRequests/account";
import ButtonLogout from "@/app/components/ButtonLogout";
import Profile from "@/app/me/Profile";
import ProfileForm from "@/app/me/profile-form";
import envConfig from "@/config";
import { cookies } from "next/headers";
import React from "react";

export default async function Page() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value ?? "";

  const result = await accountApiRequest.me(sessionToken);

  return (
    <div>
      <h1>Welcome {result.payload.data.name}</h1>

      {/* <Profile /> */}
      <ProfileForm initialData={result.payload.data} />
      <ButtonLogout />
    </div>
  );
}
