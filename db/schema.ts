import { index, integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const shortLinks = pgTable(
	'short_links',
	{
		id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
		shortCode: text('short_code').notNull(),
		clerkUserId: text('clerk_user_id').notNull(),
		url: text('url').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	},
	(table) => ({
		shortCodeUq: uniqueIndex('short_links_short_code_uq').on(table.shortCode),
		clerkUserIdIdx: index('short_links_clerk_user_id_idx').on(table.clerkUserId),
	}),
);

export type ShortLink = typeof shortLinks.$inferSelect;
export type NewShortLink = typeof shortLinks.$inferInsert;
