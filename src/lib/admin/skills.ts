import { z } from "zod";
import { db, skills as Skills, eq } from "astro:db";
import { type ActionResult, fail, withTry } from "./utils.ts";
import { RequiredTrimmed, IdNumber } from "@/lib/schemas.ts";

export async function addSkill(
  userId: number,
  form: FormData,
): Promise<ActionResult> {
  const schema = z.object({ name: RequiredTrimmed });
  const { success, error, data } = schema.safeParse(
    Object.fromEntries(form.entries()),
  );
  if (!success) return fail(z.prettifyError(error) ?? "Invalid input");
  const { name } = data;
  return withTry("add_skill", async () => {
    await db.insert(Skills).values({ user_id: userId, name });
  });
}

export async function deleteSkill(
  _userId: number,
  form: FormData,
): Promise<ActionResult> {
  const { success, error, data } = z
    .object({ id: IdNumber })
    .safeParse(Object.fromEntries(form.entries()));
  if (!success) return fail(z.prettifyError(error) ?? "Invalid input");
  const { id } = data;
  return withTry("delete_skill", async () => {
    await db.delete(Skills).where(eq(Skills.id, id));
  });
}
