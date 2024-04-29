import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db, User, Session } from "astro:db";
import { Lucia } from "lucia";

const adapter = new DrizzleSQLiteAdapter(db as any, Session, User);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: import.meta.env.PROD
		}
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
	}
}