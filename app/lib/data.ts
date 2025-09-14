import { auth } from "@/auth";
import postgres from "postgres";
import { Category, TransactionsTable } from "./definitions";

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

const ITEMS_PER_PAGE = 6;
export async function fetchTransactions(currentPage: number): Promise<TransactionsTable[]> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const transactions = await sql<TransactionsTable[]>`
      SELECT
        transactions.id,
        transactions.title,
        transactions.amount,
        transactions.description,
        transactions.date,
        transactions.category_id,
        categories.name AS category_name
      FROM transactions
      JOIN categories ON transactions.category_id = categories.id
      WHERE transactions.user_id = ${session.user.id}
      ORDER BY transactions.created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return transactions;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Transactions.");
  }
}
