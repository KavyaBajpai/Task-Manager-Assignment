// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   schema: "./schema/schema.js",              // update if your schema is elsewhere
//   out: "./drizzle/migrations",
//   driver: "pg-neon",  
//   dialect: "postgresql",          // <-- change this line
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL!,
//   },
// });


import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './schema/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
