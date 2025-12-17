"use server";

import { auth } from "@/auth";
import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchTransactionsPages } from "../data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const TransactionSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  amount: z.coerce.number().positive({ message: "Amount must be greater than 0" }),
  type: z.enum(["expense", "income"]),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().max(500, { message: "Description must be less than 500 characters" }).optional().nullable(),
  date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), { message: "Invalid date" }),
});

export type TransactionFormState = {
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
  prevState: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return {message: "Unauthorized: sign in required."}
  }

  const validatedFields = TransactionSchema.safeParse({
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
      VALUES (${session.user.id}, ${title}, ${(type === "expense" ? -1 : 1) * amount}, ${category === "empty" ? null : category}, ${description ?? null}, ${date})
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

export async function editTransaction(
  id: string,
  prevState: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return {message: "Unauthorized: sign in required."}
  }

  const validatedFields = TransactionSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    amount: formData.get("amount"),
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
      message: "Missing or invalid fields. Failed to edit category.",
    };
  }

  const { title, type, amount, category, description, date } = validatedFields.data;
  const redirectTo = formData.get("redirectTo") as string | null;

  try {
    await sql`
      UPDATE transactions
      SET
        title = ${title},
        amount = ${(type === "income" ? 1 : -1) * amount},
        category_id = ${category === "empty" ? null : category},
        description = ${description || null},
        date = ${date}
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;
  } catch (error) {
    return {
      ...prevState,
      message: "Database Error: Failed to edit transaction.",
    };
  }

  const params = new URLSearchParams(redirectTo || "");

  const pageParam = params.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const typeFilter = params.get("type") || "all";
  const categoriesFilter = params.get("categories") || "all";

  const totalPages = await fetchTransactionsPages(typeFilter, categoriesFilter);
  const targetPage = currentPage > totalPages ? totalPages : currentPage;
  params.set("page", String(targetPage));
  
  revalidatePath("/dashboard/transactions");
  redirect(`/dashboard/transactions?${params.toString()}`);
}

export async function deleteTransaction(id: string, redirectTo: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return {message: "Unauthorized: sign in required."}
  }

  try {
    await sql`DELETE FROM transactions WHERE id = ${id} AND user_id = ${session.user.id}`;
  } catch (error) {
    return {message: "Database Error: Failed to delete transaction."};
  }

  const params = new URLSearchParams(redirectTo || "");

  const pageParam = params.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const typeFilter = params.get("type") || "all";
  const categoriesFilter = params.get("categories") || "all";

  const totalPages = await fetchTransactionsPages(typeFilter, categoriesFilter);
  const targetPage = currentPage > totalPages ? totalPages : currentPage;
  params.set("page", String(targetPage));

  revalidatePath("/dashboard/transactions");
  redirect(`/dashboard/transactions?${params.toString()}`);
}
