import { z } from "zod";
import { relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { post } from "@/db/schema/post";

export const category = pgTable("category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});

export const categoryRelations = relations(category, ({ many }) => ({
  posts: many(post),
}));

// Zod Schema for category model
export const categorySchema = createInsertSchema(category);
export type CategorySchema = z.infer<typeof categorySchema>;
