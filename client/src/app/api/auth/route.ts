import { decodeJwt } from "@/lib/utils";

type PayloadJWT = {
  iat: number;
  exp: number;
  tokenType: string;
  userId: number;
};

export async function POST(request: Request) {
  const res = await request.json();

  const sessionToken = res.sessionToken;

  if (!sessionToken) {
    return Response.json(
      { message: "No session token found" },
      {
        status: 400,
      }
    );
  }

  const payload = decodeJwt<PayloadJWT>(sessionToken);
  const expiredDate = new Date((payload?.exp ?? 0) * 1000).toUTCString();

  return Response.json(
    {
      message: "Login successful",
    },
    {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Expires=${expiredDate}; Secure`,
      },
    }
  );
}
