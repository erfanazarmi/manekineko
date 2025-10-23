"use server";

import postgres from "postgres";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function setCalendarType(calendarType: "gregorian" | "jalali") {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: sign in required.");
  }

  try {
    await sql`
      UPDATE user_settings
      SET calendar_type = ${calendarType}
      WHERE user_id = ${session.user.id}
    `;
  } catch (error) {
    return {message: "Database Error: Failed to delete category."};
  }

  revalidatePath("/dashboard/settings");
}
