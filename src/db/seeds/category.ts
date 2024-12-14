import { category, CategorySchema } from "@/db/schema/category";
import { DB } from "@/db";

const mock: CategorySchema[] = [
  {
    name: "Node.js",
  },
  {
    name: "React",
  },
  {
    name: "Python",
  },
  {
    name: "Javascript",
  },
  {
    name: "Algorithms",
  },
  {
    name: "DevOps",
  },
];

export async function seed(db: DB) {
  await db.insert(category).values(mock);
}
