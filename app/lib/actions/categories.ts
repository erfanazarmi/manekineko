"use server";

import { auth } from "@/auth";
import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const CategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }).max(50, { message: "Category name must be less than 50 characters" }),
});

export type CategoryFormState = {
  errors?: {
    errors: string[];
    properties: {
      name?: { errors: string[] };
    };
  };
  message?: string | null;
};

export async function addCategory(
  prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return {message: "Unauthorized: sign in required."}
  }

  const validatedFields = CategorySchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    const treeError = z.treeifyError(validatedFields.error);
    return {
      ...prevState,
      errors: {
        errors: treeError.errors,
        properties: treeError.properties ?? {},
      },
      message: "Missing or invalid fields. Failed to create category.",
    };
  }

  const { name } = validatedFields.data;

  try {
    await sql`
      INSERT INTO categories (user_id, name)
      VALUES (${session.user.id}, ${name})
    `;
  } catch (error) {
    return {
      ...prevState,
      message: "Database Error: Failed to create category.",
    };
  }

  revalidatePath("/dashboard/settings");
  return {message: "Successful"};
}

export async function editCategory(
  id: string,
  prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return {message: "Unauthorized: sign in required."}
  }

  const validatedFields = CategorySchema.safeParse({
    name: formData.get("name"),
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

  const { name } = validatedFields.data;

  try {
    await sql`
      UPDATE categories
      SET name = ${name}
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;
  } catch (error) {
    return {
      ...prevState,
      message: "Database Error: Failed to edit category.",
    };
  }

  revalidatePath("/dashboard/settings");
  return {message: "Successful"};
}

export async function deleteCategory(
  id: string,
  prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return {message: "Unauthorized: sign in required."}
  }

  try {
    await sql`DELETE FROM categories WHERE id = ${id} AND user_id = ${session.user.id}`;
  } catch (error) {
    return {message: "Database Error: Failed to create category."};
  }

  revalidatePath("/dashboard/settings");
  return {message: "Successful"};
}
