import { InferSelectModel, relations } from "drizzle-orm";
import {
	integer,
	pgTable,
	serial,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { post } from "@/db/schema/post";

export const user = pgTable("user", {
	id: serial("id").notNull().primaryKey(),
	fullName: varchar("fullName", { length: 255 }).notNull(),
	age: integer("age").notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
	posts: many(post),
}));

export type SelectUserModel = InferSelectModel<typeof user>;

const baseSchema = createInsertSchema(user, {
	id: (schema) => schema.id.min(1),
	fullName: (schema) => schema.fullName.min(1),
	password: (schema) => schema.password.min(1),
	age: z.coerce.number().min(18).max(99),
	email: (schema) => schema.email.email(),
}).pick({ id: true, fullName: true, password: true, age: true, email: true });

export const userSchema = z.union([
	z.object({
		mode: z.literal("signUp"),
		email: baseSchema.shape.email,
		password: baseSchema.shape.password,
		fullName: baseSchema.shape.fullName,
		age: baseSchema.shape.age,
	}),
	z.object({
		mode: z.literal("signIn"),
		email: baseSchema.shape.email,
		password: baseSchema.shape.password,
	}),
	z.object({
		mode: z.literal("update"),
		fullName: baseSchema.shape.fullName,
		age: baseSchema.shape.age,
		id: baseSchema.shape.id,
	}),
]);

export type UserSchema = z.infer<typeof userSchema>;