import { z } from "zod";
import { db, user_languages as UserLanguages, eq } from "astro:db";
import { type ActionResult, fail, withTry } from "./utils.ts";
import { IdNumber } from "@/lib/schemas.ts";

export async function addUserLanguage(
  userId: number,
  form: FormData,
): Promise<ActionResult> {
  const { success, error, data } = z
    .object({ language_id: IdNumber })
    .safeParse(Object.fromEntries(form.entries()));
  if (!success) return fail(z.prettifyError(error) ?? "Invalid input");
  const { language_id } = data;
  return withTry("add_language", async () => {
    await db.insert(UserLanguages).values({ user_id: userId, language_id });
  });
}

export async function deleteUserLanguage(
  _userId: number,
  form: FormData,
): Promise<ActionResult> {
  const { success, error, data } = z
    .object({ id: IdNumber })
    .safeParse(Object.fromEntries(form.entries()));
  if (!success) return fail(z.prettifyError(error) ?? "Invalid input");
  const { id } = data;
  return withTry("delete_language", async () => {
    await db.delete(UserLanguages).where(eq(UserLanguages.id, id));
  });
}
