import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return new Response(JSON.stringify({ status: "invalid" }), { status: 400 });
  }

  interface User {
    id: string;
    verification_token: string;
    verification_expires: string;
  }

  let user: User | undefined;

  try {
    const result = await sql<User[]>`
      SELECT id, verification_token, verification_expires
      FROM users
      WHERE verification_token = ${token}::text
    `;

    [user] = result;

    if (!user) {
      return new Response(JSON.stringify({ status: "invalid" }), { status: 400 });
    }

    const expires = new Date(user.verification_expires).getTime();
    const now = Date.now();

    if (expires < now) {
      return new Response(JSON.stringify({ status: "expired" }), { status: 410 });
    }

    await sql`
      UPDATE users
      SET email_verified = true,
          verification_token = null,
          verification_expires = null
      WHERE id = ${user.id}
    `;

    return new Response(JSON.stringify({ status: "success" }), { status: 200 });
  } catch (error) {
    console.error("[ERROR] Verification process failed:", error);
    return new Response(JSON.stringify({ status: "error" }), { status: 500 });
  }
}
