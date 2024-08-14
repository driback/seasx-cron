import type { Config } from "drizzle-kit";

export default {
	schema: "./src/server/database/drizzle/schema/*",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL ?? "",
	},
	introspect: { casing: "camel" },
	out: "drizzle",
	verbose: true,
	strict: true,
} satisfies Config;
