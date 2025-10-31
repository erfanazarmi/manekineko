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
      verification_expires TIMESTAMPTZ
    );
  `;
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'calendar_type_enum') THEN
        CREATE TYPE calendar_type_enum AS ENUM ('gregorian', 'jalali');
      END IF;
    END
    $$;
  `;
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'language_enum') THEN
        CREATE TYPE language_enum AS ENUM ('en', 'fa');
      END IF;
    END
    $$;
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      calendar_type calendar_type_enum NOT NULL DEFAULT 'gregorian',
      language language_enum NOT NULL DEFAULT 'en'
    );
  `;
  await sql`
    CREATE OR REPLACE FUNCTION create_default_settings()
    RETURNS trigger AS $$
    BEGIN
      INSERT INTO user_settings (user_id, calendar_type, language)
      VALUES (NEW.id, 'gregorian', 'en');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'add_default_settings'
      ) THEN
        CREATE TRIGGER add_default_settings
        AFTER INSERT ON users
        FOR EACH ROW
        EXECUTE FUNCTION create_default_settings();
      END IF;
    END;
    $$;
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

  await sql`
    INSERT INTO user_settings (user_id, calendar_type)
    SELECT u.id, 'gregorian'
    FROM users u
    LEFT JOIN user_settings s ON u.id = s.user_id
    WHERE s.user_id IS NULL;
  `;

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
