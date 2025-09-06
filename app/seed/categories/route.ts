import postgres from "postgres";
import { categories } from "@/app/lib/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function SeedCategories() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      UNIQUE (user_id, name)
    )
  `;

  const insertedCategories = await Promise.all(
    categories.map(async (category) => {
      return sql`
        INSERT INTO categories (id, user_id, name)
        VALUES (${category.id}, ${category.user_id}, ${category.name})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedCategories;
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(
      { error: "Seeding is not allowed in production" },
      { status: 403 }
    );
  }

  try {
    const result = await sql.begin((sql) => [SeedCategories()]);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
