import authApiRequests from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const res = await request.json();

  const force = res?.force as boolean | undefined;

  if (force) {
    return Response.json(
      {
        message: "Force logout successful",
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `sessionToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
        },
      }
    );
  }

  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  if (!sessionToken) {
    return Response.json(
      { message: "No session token found" },
      {
        status: 401,
      }
    );
  }

  try {
    const res = await authApiRequests.logoutFromNextServerToServer(
      sessionToken
    );
    return Response.json(res.payload, {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
      },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        { message: "An unexpected error occurred" },
        {
          status: 500,
        }
      );
    }
  }
}
