"use server";

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
