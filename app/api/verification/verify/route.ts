import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(request: Request) {
  const { token } = await request.json();

  console.log("[DEBUG] Incoming token from URL:", token);

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
      return new Response(JSON.stringify({ status: "notfound" }), { status: 404 });
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
      return new Response(JSON.stringify({ status: "expired" }), { status: 410 });
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
    return new Response(JSON.stringify({ status: "success" }), { status: 200 });
  } catch (error) {
    console.error("[ERROR] Verification process failed:", error);
    return new Response(JSON.stringify({ status: "error" }), { status: 500 });
  }
}
