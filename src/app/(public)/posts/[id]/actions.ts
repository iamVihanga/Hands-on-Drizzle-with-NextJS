"use server";

import { db } from "@/db";
import { comment, CommentSchema, commentSchema } from "@/db/schema/comment";
import { executeAction } from "@/db/utils/executeAction";
import { revalidatePath } from "next/cache";

export async function createComment(data: CommentSchema) {
  return executeAction({
    actionFn: async () => {
      const validatedData = commentSchema.parse(data);
      await db.insert(comment).values(validatedData);

      revalidatePath(`/posts/${validatedData.id}`);
    },
    isProtected: true,
    clientSuccessMessage: "Commented successfully",
    serverErrorMessage: "createComment",
  });
}
