import { faker } from "@faker-js/faker";

import { DB, db } from "@/db";
import { postTags, PostTagsSchema } from "@/db/schema/postTags";

async function mock() {
  const [postsData, tagsData] = await Promise.all([
    db.query.post.findMany(),
    db.query.tag.findMany(),
  ]);

  const randomPosts = faker.helpers.arrayElements(postsData);

  const data: PostTagsSchema[] = randomPosts.flatMap((post) => {
    const randomTags = faker.helpers.arrayElements(tagsData);
    return randomTags.map((tag) => ({ postId: post.id, tagId: tag.id }));
  });

  return data;
}

export async function seed(db: DB) {
  const insertData = await mock();

  await db.insert(postTags).values(insertData);
}