import { z } from "zod";
import { db, users as Users, eq } from "astro:db";
import { type ActionResult, fail, withTry } from "./utils.ts";
import { RequiredTrimmed } from "@/lib/schemas.ts";

export async function updateUserBasic(
  userId: number,
  form: FormData,
): Promise<ActionResult> {
  const schema = z.object({
    first_name: RequiredTrimmed,
    last_name: RequiredTrimmed,
    email: RequiredTrimmed,
  });
  const { success, error, data } = schema.safeParse(
    Object.fromEntries(form.entries()),
  );
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
  const { first_name, last_name, email } = data;
  return withTry("update_user_basic", async () => {
    await db
      .update(Users)
      .set({ first_name, last_name, email })
      .where(eq(Users.id, userId));
  });
}
