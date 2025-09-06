import bcrypt from "bcrypt";
import postgres from "postgres";
import { users } from "../../lib/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      firstname VARCHAR(255),
      lastname VARCHAR(255),
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email_verified BOOLEAN DEFAULT false,
      verification_token TEXT,
      verification_expires TIMESTAMP
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, firstname, lastname, email, password, email_verified)
        VALUES (${user.id}, ${user.firstname}, ${user.lastname}, ${user.email}, ${hashedPassword}, ${user.email_verified})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(
      { error: "Seeding is not allowed in production" },
      { status: 403 }
    );
  }

  try {
    const result = await sql.begin((sql) => [seedUsers()]);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
