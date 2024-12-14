"use server";

import { executeAction } from "@/db/utils/executeAction";
import { signOut as authSignOut } from "@/lib/auth";

export async function signOut() {
  return executeAction({
    actionFn: async () => {
      await authSignOut();
    },
    isProtected: false,
    clientSuccessMessage: "Signed out successfully",
    serverErrorMessage: "signOut",
  });
}
