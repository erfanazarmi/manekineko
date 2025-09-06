import postgres from "postgres";
import { transactions } from "../../lib/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function seedTransactions() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      amount INTEGER NOT NULL,
      category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
      description TEXT,
      date TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  const insertedTransactions = await Promise.all(
    transactions.map(async (transaction) => {
      return sql`
        INSERT INTO transactions (user_id, title, amount, category_id, description, date)
        VALUES (${transaction.user_id}, ${transaction.title}, ${transaction.amount}, ${transaction.category_id}, ${transaction.description || null}, ${transaction.date})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedTransactions;
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(
      { error: "Seeding is not allowed in production" },
      { status: 403 }
    );
  }

  try {
    const result = await sql.begin((sql) => [seedTransactions()]);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
