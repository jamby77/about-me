import { z } from "zod";
import { db, experience as Experience, eq } from "astro:db";
import { type ActionResult, fail, withTry } from "./utils";
import {
  RequiredTrimmed,
  OptionalTrimmed,
  RequiredDate,
  OptionalDate,
  IdNumber,
} from "@/lib/schemas.ts";

export async function addExperience(
  userId: number,
  form: FormData,
): Promise<ActionResult> {
  const schema = z.object({
    name: RequiredTrimmed,
    title: RequiredTrimmed,
    role: RequiredTrimmed,
    url: OptionalTrimmed,
    start_date: RequiredDate,
    end_date: OptionalDate,
    description: OptionalTrimmed,
    location: OptionalTrimmed,
    location_type: OptionalTrimmed,
    responsibilities: z
      .string()
      .optional()
      .transform((s) =>
        s
          ? s
              .split(/\r?\n/)
              .map((x) => x.trim())
              .filter(Boolean)
          : undefined,
      ),
    achievements: z
      .string()
      .optional()
      .transform((s) =>
        s
          ? s
              .split(/\r?\n/)
              .map((x) => x.trim())
              .filter(Boolean)
          : undefined,
      ),
    skills: z
      .array(z.string())
      .optional()
      .transform((a) =>
        a && a.length ? a.map((x) => x.trim()).filter(Boolean) : undefined,
      ),
  });
  const base = Object.fromEntries(form.entries());
  const { success, error, data } = schema.safeParse({
    ...base,
    skills: form.getAll("skills"),
  });
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
  const {
    name,
    title,
    role,
    url,
    start_date,
    end_date,
    description,
    location,
    location_type,
    responsibilities,
    achievements,
    skills,
  } = data;
  return withTry("add_experience", async () => {
    await db.insert(Experience).values({
      user_id: userId,
      name,
      title,
      role,
      url,
      start_date,
      end_date,
      description,
      location,
      location_type,
      skills,
      responsibilities,
      achievements,
    });
  });
}

export async function updateExperience(
  _userId: number,
  form: FormData,
): Promise<ActionResult> {
  const schema = z.object({
    id: IdNumber,
    name: RequiredTrimmed,
    title: RequiredTrimmed,
    role: RequiredTrimmed,
    url: OptionalTrimmed,
    start_date: RequiredDate,
    end_date: OptionalDate,
    description: OptionalTrimmed,
    location: OptionalTrimmed,
    location_type: OptionalTrimmed,
    responsibilities: z
      .string()
      .optional()
      .transform((s) =>
        s
          ? s
              .split(/\r?\n/)
              .map((x) => x.trim())
              .filter(Boolean)
          : undefined,
      ),
    achievements: z
      .string()
      .optional()
      .transform((s) =>
        s
          ? s
              .split(/\r?\n/)
              .map((x) => x.trim())
              .filter(Boolean)
          : undefined,
      ),
    skills: z
      .array(z.string())
      .optional()
      .transform((a) =>
        a && a.length ? a.map((x) => x.trim()).filter(Boolean) : undefined,
      ),
  });
  const base = Object.fromEntries(form.entries());
  const { success, error, data } = schema.safeParse({
    ...base,
    skills: form.getAll("skills"),
  });
  if (!success) return fail(z.prettifyError(error) ?? "Invalid input");
  const {
    id,
    name,
    title,
    role,
    url,
    start_date,
    end_date,
    description,
    location,
    location_type,
    responsibilities,
    achievements,
    skills,
  } = data;
  return withTry("update_experience", async () => {
    await db
      .update(Experience)
      .set({
        name,
        title,
        role,
        url,
        start_date,
        end_date,
        description,
        location,
        location_type,
        skills,
        responsibilities,
        achievements,
      })
      .where(eq(Experience.id, id));
  });
}

export async function deleteExperience(
  _userId: number,
  form: FormData,
): Promise<ActionResult> {
  const { success, error, data } = z
    .object({ id: IdNumber })
    .safeParse(Object.fromEntries(form.entries()));
  if (!success) return fail(z.prettifyError(error) ?? "Invalid input");
  const { id } = data;
  return withTry("delete_experience", async () => {
    await db.delete(Experience).where(eq(Experience.id, id));
  });
}
