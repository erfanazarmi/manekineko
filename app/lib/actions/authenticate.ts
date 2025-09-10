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
