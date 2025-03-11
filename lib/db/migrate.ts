import path from 'path';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { client, db } from './drizzle';
import dotenv from 'dotenv';
dotenv.config();


async function main() {
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), '/lib/db/migrations'),
  });
  console.log(`Migrations complete`);
}

main();
