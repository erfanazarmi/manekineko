import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const isProd = process.env.NODE_ENV === "production";
  const redirectUrl = isProd
    ? "https://manekineko.netlify.app"
    : "http://localhost:3000";

  console.log("[DEBUG] Incoming token from URL:", token);

  if (!token) {
    console.log("[DEBUG] No token provided in URL.");
    return Response.redirect(`${redirectUrl}/verify-result?status=invalid`);
  }

  interface User {
    id: string;
    verification_token: string;
    verification_expires: string;
  }

  let user: User | undefined;

  try {
    console.log("[DEBUG] Running SELECT query for token:", token);

    const result = await sql<User[]>`
      SELECT id, verification_token, verification_expires
      FROM users
      WHERE verification_token = ${token}::text
    `;

    console.log("[DEBUG] Full query result:", result);

    [user] = result;

    if (!user) {
      console.log("[DEBUG] User not found in DB for token:", token);
      return Response.redirect(`${redirectUrl}/verify-result?status=notfound`);
    }

    console.log("[DEBUG] User found:", user);

    const expires = new Date(user.verification_expires).getTime();
    const now = Date.now();

    console.log("[DEBUG] verification_expires (DB):", user.verification_expires);
    console.log("[DEBUG] verification_expires (ms):", expires);
    console.log("[DEBUG] Current time (ms):", now);
    console.log("[DEBUG] Current time (ISO):", new Date(now).toISOString());

    if (expires < now) {
      console.log("[DEBUG] Token is expired!");
      return Response.redirect(`${redirectUrl}/verify-result?status=expired`);
    }

    console.log("[DEBUG] Token is valid, updating user...");

    await sql`
      UPDATE users
      SET email_verified = true,
          verification_token = null,
          verification_expires = null
      WHERE id = ${user.id}
    `;

    console.log("[DEBUG] User updated successfully.");

  } catch (error) {
    console.error("[ERROR] Verification process failed:", error);
  }

  return Response.redirect(`${redirectUrl}/verify-result?status=success`);
}
