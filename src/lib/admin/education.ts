import { z } from "zod";
import { db, education as Education, eq } from "astro:db";
import { type ActionResult, fail, withTry } from "./types";
import {
  RequiredTrimmed,
  OptionalTrimmed,
  RequiredDate,
  OptionalDate,
  IdNumber,
  OptionalUrl,
} from "@/lib/schemas.ts";

export async function addEducation(
  userId: number,
  form: FormData,
): Promise<ActionResult> {
  const schema = z.object({
    name: RequiredTrimmed,
    degree: RequiredTrimmed,
    field: OptionalTrimmed,
    start_date: RequiredDate,
    end_date: OptionalDate,
    url: OptionalUrl,
  });
  const fromEntries = Object.fromEntries(form.entries());
  const { success, error, data } = schema.safeParse(fromEntries);
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
  const { name, degree, field, start_date, end_date, url } = data;
  return withTry("add_education", async () => {
    await db.insert(Education).values({
      user_id: userId,
      name,
      degree,
      field,
      start_date,
      end_date,
      url,
    });
  });
}

export async function updateEducation(
  _userId: number,
  form: FormData,
): Promise<ActionResult> {
  const schema = z.object({
    id: IdNumber,
    name: RequiredTrimmed,
    degree: RequiredTrimmed,
    field: OptionalTrimmed,
    start_date: RequiredDate,
    end_date: OptionalDate,
    url: OptionalUrl,
  });
  const { success, error, data } = schema.safeParse(
    Object.fromEntries(form.entries()),
  );
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
  const { id, name, degree, field, start_date, end_date, url } = data;
  return withTry("update_education", async () => {
    await db
      .update(Education)
      .set({ name, degree, field, start_date, end_date, url })
      .where(eq(Education.id, id));
  });
}

export async function deleteEducation(
  _userId: number,
  form: FormData,
): Promise<ActionResult> {
  const { success, error, data } = z
    .object({ id: IdNumber })
    .safeParse(Object.fromEntries(form.entries()));
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
  const { id } = data;
  return withTry("delete_education", async () => {
    await db.delete(Education).where(eq(Education.id, id));
  });
}
