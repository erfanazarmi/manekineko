"use server";

import { signIn, auth } from "@/auth";
import { AuthError, CredentialsSignin } from "next-auth";
import { z } from "zod";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      if (error instanceof CredentialsSignin) {
        if ((error as any).code === "email_not_verified") {
          return "Your email is not verified.";
        }
        return "Invalid credentials.";
      } else {
        return "Something went wrong.";
      }
    }
    throw error;
  }
}

export type RegisterState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; issues?: any };

export async function register(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const isProd = process.env.NODE_ENV === "production";
  const url = isProd
    ? "https://manekineko.netlify.app"
    : "http://localhost:3000";

  try {
    const res = await fetch(`${url}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: formData.get("firstname"),
        lastname: formData.get("lastname"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { status: "error", message: data.error, issues: data.issues };
    }

    return { status: "success", message: "User registered successfully." };
  } catch (error) {
    console.error("Register action error:", error);
    return { status: "error", message: "Something went wrong." };
  }
}

const AddFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  amount: z.coerce.number().positive({ message: "Amount must be greater than 0" }),
  type: z.enum(["expense", "income"]),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().max(500, { message: "Description must be less than 500 characters" }).optional().nullable(),
  date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), { message: "Invalid date" }),
});

export type AddTransactionState = {
  errors?: {
    errors: string[];
    properties: {
      title?: { errors: string[] };
      amount?: { errors: string[] };
      type?: { errors: string[] };
      category?: { errors: string[] };
      description?: { errors: string[] };
      date?: { errors: string[] };
    };
  };
  message?: string | null;
};

export async function addTransaction(
  prevState: AddTransactionState,
  formData: FormData
): Promise<AddTransactionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return {message: "Unauthorized: sign in required."}
  }

  const validatedFields = AddFormSchema.safeParse({
    title: formData.get("title"),
    amount: formData.get("amount"),
    type: formData.get("type"),
    category: formData.get("category"),
    description: formData.get("description"),
    date: formData.get("date"),
  });

  if (!validatedFields.success) {
    const treeError = z.treeifyError(validatedFields.error);
    return {
      ...prevState,
      errors: {
        errors: treeError.errors,
        properties: treeError.properties ?? {},
      },
      message: "Missing or invalid fields. Failed to create transaction.",
    };
  }

  const { title, amount, type, category, description, date } = validatedFields.data;

  try {
    await sql`
      INSERT INTO transactions (user_id, title, amount, category_id, description, date)
      VALUES (${session.user.id}, ${title}, ${(type === "expense" ? -1 : 1) * amount}, ${category}, ${description ?? null}, ${date})
    `;
  } catch (error) {
    return {
      ...prevState,
      message: "Database Error: Failed to create transaction.",
    };
  }

  return {
    ...prevState,
    message: "Transaction created successfully",
    errors: { errors: [], properties: {} },
  };
}
