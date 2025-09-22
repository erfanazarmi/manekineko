import { auth } from "@/auth";
import postgres from "postgres";
import { Category, Transaction, TransactionsTable } from "./definitions";

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

export async function fetchTransactionsPages() {
  try {
    const data = await sql`
      SELECT COUNT(*) 
      FROM transactions
    `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of transactions.");
  }
}

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
      LEFT JOIN categories ON transactions.category_id = categories.id
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

export async function fetchTransactionById(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const transaction = await sql<Transaction[]>`
      SELECT * FROM transactions
      WHERE user_id = ${session.user.id} AND id = ${id}
    `;

    const formattedTransaction = {
      ...transaction[0],
      date: new Date(transaction[0].date).toLocaleDateString("en-CA")
    };

    return formattedTransaction;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch transaction.");
  }
}
