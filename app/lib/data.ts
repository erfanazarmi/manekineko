import { auth } from "@/auth";
import postgres from "postgres";
import { Category } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getCategories(): Promise<Category[]> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const categories = await sql<Category[]>`
      SELECT * FROM categories WHERE user_id = ${session.user.id}
    `;
    return categories;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}
