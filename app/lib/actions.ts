"use server";

import { signIn } from "@/auth";
import { AuthError, CredentialsSignin } from "next-auth";

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
