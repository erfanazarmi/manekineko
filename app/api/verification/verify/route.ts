import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const isProd = process.env.NODE_ENV === "production";
  const redirectUrl = isProd
    ? "https://manekineko.netlify.app"
    : "http://localhost:3000";

  if (!token) {
    return Response.redirect(`${redirectUrl}/verify-result?status=invalid`);
  }

  const [user] = await sql`
    SELECT id, verification_token, verification_expires
    FROM users
    WHERE verification_token = ${token}
  `;

  if (!user) {
    return Response.redirect(`${redirectUrl}/verify-result?status=notfound`);
  }

  const expires = new Date(user.verification_expires).getTime();
  const now = Date.now();

  if (expires < now) {
    return Response.redirect(`${redirectUrl}/verify-result?status=expired`);
  }

  await sql`
    UPDATE users
    SET email_verified = true,
        verification_token = null,
        verification_expires = null
    WHERE id = ${user.id}
  `;

  return Response.redirect(`${redirectUrl}/verify-result?status=success`);
}
