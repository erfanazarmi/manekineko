import { createVerificationToken } from "@/app/lib/verify/token";
import { sendVerificationEmail } from "@/app/lib/verify/mailer";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(request: Request) {
  const { email } = await request.json();

  const [user] = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const token = await createVerificationToken(user.id);

  await sendVerificationEmail(email, token);

  return new Response("Verification email sent", { status: 200 });
}
