import { z } from "zod";
import { db, certificates as Certificates, eq } from "astro:db";
import { type ActionResult, fail, withTry } from "./types";
import {
  RequiredTrimmed,
  OptionalTrimmed,
  OptionalDate,
  IdNumber,
} from "@/lib/schemas.ts";

export async function addCertificate(
  userId: number,
  form: FormData,
): Promise<ActionResult> {
  const schema = z.object({
    name: RequiredTrimmed,
    date: OptionalDate,
    description: OptionalTrimmed,
    url: OptionalTrimmed,
  });
  const { success, error, data } = schema.safeParse(
    Object.fromEntries(form.entries()),
  );
  if (!success) return fail(z.prettifyError(error) ?? "Invalid input");
  const { name, date, description, url } = data;
  return withTry("add_certificate", async () => {
    await db
      .insert(Certificates)
      .values({ user_id: userId, name, date, description, url });
  });
}

export async function updateCertificate(
  _userId: number,
  form: FormData,
): Promise<ActionResult> {
  const schema = z.object({
    id: IdNumber,
    name: RequiredTrimmed,
    date: OptionalDate,
    description: OptionalTrimmed,
    url: OptionalTrimmed,
  });
  const { success, error, data } = schema.safeParse(
    Object.fromEntries(form.entries()),
  );
  if (!success) return fail(z.prettifyError(error) ?? "Invalid input");
  const { id, name, date, description, url } = data;
  return withTry("update_certificate", async () => {
    await db
      .update(Certificates)
      .set({ name, date, description, url })
      .where(eq(Certificates.id, id));
  });
}

export async function deleteCertificate(
  _userId: number,
  form: FormData,
): Promise<ActionResult> {
  const { success, error, data } = z
    .object({ id: IdNumber })
    .safeParse(Object.fromEntries(form.entries()));
  if (!success) return fail(z.prettifyError(error) ?? "Invalid input");
  const { id } = data;
  return withTry("delete_certificate", async () => {
    await db.delete(Certificates).where(eq(Certificates.id, id));
  });
}
