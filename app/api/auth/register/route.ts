import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import postgres from "postgres";
import { z } from "zod";
import { createVerificationToken } from "@/app/lib/verify/token";
import { sendVerificationEmail } from "@/app/lib/verify/mailer";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const firstnameSchema = z
  .string()
  .min(1, "First name is required")
  .max(50, "First name must be less than 50 characters");

const lastnameSchema = z
  .string()
  .min(1, "Last name is required")
  .max(50, "Last name must be less than 50 characters");

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  firstname: firstnameSchema,
  lastname: lastnameSchema
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }

    const { email, password, firstname, lastname } = parsed.data;

    const existingUser = await sql<{ id: number }[]>`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await sql`
      INSERT INTO users (email, password, firstname, lastname) 
      VALUES (${email}, ${hashedPassword}, ${firstname}, ${lastname})
      RETURNING id, email
    `;

    const token = await createVerificationToken(user.id);
    await sendVerificationEmail(user.email, token);

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
