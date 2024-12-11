import { z } from "zod";
import {
  pgTable,
  integer,
  serial,
  text,
  timestamp,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

import { category, comment, user, postTags } from "@/db/schema";

// export const statusEnum = pgEnum("status", ["draft", "archived", "published"]);

export const post = pgTable("post", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  title: varchar("title", { length: 255 }).notNull(),
  shortDescription: text("short_description"),
  //   status: statusEnum("status"),
  content: text("content").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => category.id),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const postRelations = relations(post, ({ one, many }) => ({
  user: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
  tags: many(postTags),
  comments: many(comment),
  category: one(category, {
    fields: [post.categoryId],
    references: [category.id],
  }),
}));

// Zod Schema for post model
const baseSchema = createInsertSchema(post, {
  title: (schema) =>
    schema.title.min(1, { message: "Post title is required !" }),
  shortDescription: (schema) =>
    schema.shortDescription
      .min(1, { message: "Short description is required !" })
      .max(255, {
        message: "Description length must be less than 255 characters !",
      }),
  userId: (schema) => schema.userId.min(1),
}).pick({
  title: true,
  shortDescription: true,
  userId: true,
  categoryId: true,
  content: true,
});

export const postSchema = z.union([
  z.object({
    mode: z.literal("create"),
    title: baseSchema.shape.title,
    shortDescription: baseSchema.shape.shortDescription,
    userId: baseSchema.shape.userId,
    categoryId: baseSchema.shape.categoryId,
    content: baseSchema.shape.content,
    tagIds: z.array(z.number()),
  }),
  z.object({
    mode: z.literal("edit"),
    id: z.number().min(1),
    title: baseSchema.shape.title,
    shortDescription: baseSchema.shape.shortDescription,
    userId: baseSchema.shape.userId,
    categoryId: baseSchema.shape.categoryId,
    content: baseSchema.shape.content,
    tagIds: z.array(z.number()),
  }),
]);

export type PostSchema = z.infer<typeof postSchema>;
export type SelectPostModel = InferSelectModel<typeof post>;
