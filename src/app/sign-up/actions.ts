"use server";

import { redirect } from "next/navigation";

import { executeAction } from "@/db/utils/executeAction";
import { user, UserSchema, userSchema } from "@/db/schema/user";
import { db } from "@/db";

export async function signUp(data: UserSchema) {
  return executeAction({
    actionFn: async () => {
      const validatedData = userSchema.parse(data);
      if (validatedData.mode === "signUp") {
        await db.insert(user).values(validatedData);
        redirect("/sign-in");
      }
    },
    isProtected: false,
    clientSuccessMessage: "Signed up successfully",
    serverErrorMessage: "signUp",
  });
}
