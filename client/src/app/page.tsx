import ButtonRedirect from "@/app/components/ButtonRedirect";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  const cookiesStore = cookies();
  const sessionToken = cookiesStore.get("sessionToken")?.value;

  return (
    <main>
      <ul>
        {sessionToken ? (
          <li>
            <Link href={"/products"}>View Products</Link>
          </li>
        ) : (
          <li>
            <Link href={"/login"}>Login</Link>
          </li>
        )}
      </ul>
      {/* <ButtonRedirect /> */}
    </main>
  );
}
