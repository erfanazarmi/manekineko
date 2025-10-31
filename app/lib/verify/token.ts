import crypto from "crypto";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function createVerificationToken(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60).toISOString();

  await sql`
    UPDATE users
    SET verification_token = ${token}, verification_expires = ${expires}
    WHERE id = ${userId}
  `;

  return token;
}
