import { Pool } from "pg"; // Changed from @neondatabase/serverless
import { drizzle } from "drizzle-orm/node-postgres"; // Changed from neon-serverless
import * as schema from "../shared/schema.js"; // Assuming shared schema is in a file named schema.js

// In a local setup, you typically don't need neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

console.log("DATABASE_URL being used:", process.env.DATABASE_URL);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Test the connection pool immediately on startup (Optional but helpful)
// Test the connection pool immediately on startup (Optional but helpful)
pool.connect((err, client, done) => {
  if (err) {
    console.error("Error acquiring client from pool", err.stack);
    // Depending on how critical this is, you might want to exit the process
    // process.exit(1); // Only exit if a connection is absolutely required for startup
  } else {
    console.log("Database pool connected successfully!");
    // Remove client.release() from here and rely on done() below
  }
  // Call done even if there's an error, to avoid holding the client forever
  done(err); // This releases the client whether err is null or not
});

export const db = drizzle(pool, { schema });

// You might still export the pool if needed elsewhere, but drizzle instance is primary
export { pool };
