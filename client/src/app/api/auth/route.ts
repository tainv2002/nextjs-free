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

  return Response.json(
    {
      message: "Login successful",
    },
    {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=Lax;`,
      },
    }
  );
}
