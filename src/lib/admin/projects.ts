import { z } from "zod";
import { db, projects as Projects, eq } from "astro:db";
import { ENABLE_UPLOADS } from "@/lib/flags.ts";
import { imageDataUrlFromForm } from "./images.ts";
import { type ActionResult, fail, withTry } from "./utils.ts";
import {
  RequiredTrimmed,
  OptionalTrimmed,
  OptionalDate,
  IdNumber,
} from "@/lib/schemas.ts";

export async function addProject(
  userId: number,
  form: FormData,
): Promise<ActionResult> {
  const schema = z.object({
    name: RequiredTrimmed,
    description: OptionalTrimmed,
    url: OptionalTrimmed,
    repoUrl: OptionalTrimmed,
    date: OptionalDate,
    image: OptionalTrimmed,
  });
  const { success, error, data } = schema.safeParse(
    Object.fromEntries(form.entries()),
  );
  if (!success) return fail(z.prettifyError(error) ?? "Invalid input");
  const { name, description, url, repoUrl, date, image } = data;
  return withTry("add_project", async () => {
    await db.insert(Projects).values({
      user_id: userId,
      name,
      description,
      url,
      repoUrl,
      date,
      image,
    });
  });
}

export async function updateProject(
  _userId: number,
  form: FormData,
): Promise<ActionResult> {
  const schema = z.object({
    id: IdNumber,
    name: RequiredTrimmed,
    description: OptionalTrimmed,
    url: OptionalTrimmed,
    repoUrl: OptionalTrimmed,
    date: OptionalDate,
    image: OptionalTrimmed,
  });
  const { success, error, data } = schema.safeParse(
    Object.fromEntries(form.entries()),
  );
  if (!success) return fail(z.prettifyError(error) ?? "Invalid input");
  const { id, name, description, url, repoUrl, date, image } = data;
  return withTry("update_project", async () => {
    await db
      .update(Projects)
      .set({ name, description, url, repoUrl, date, image })
      .where(eq(Projects.id, id));
  });
}

export async function deleteProject(
  _userId: number,
  form: FormData,
): Promise<ActionResult> {
  const { success, error, data } = z
    .object({ id: IdNumber })
    .safeParse(Object.fromEntries(form.entries()));
  if (!success) return fail(z.prettifyError(error) ?? "Invalid input");
  const { id } = data;
  return withTry("delete_project", async () => {
    await db.delete(Projects).where(eq(Projects.id, id));
  });
}

export async function uploadProjectImage(
  userId: number,
  form: FormData,
): Promise<ActionResult> {
  if (!ENABLE_UPLOADS) return fail("Uploads are disabled");
  const idRes = z
    .object({ project_id: IdNumber })
    .safeParse(Object.fromEntries(form.entries()));
  if (!idRes.success) return fail("Invalid project id");
  const { project_id } = idRes.data as any;
  const res = await imageDataUrlFromForm(form, "project_image_file");
  if (!res.ok) return res;
  return withTry("upload_project_image", async () => {
    await db
      .update(Projects)
      .set({ image: res.dataUrl })
      .where(eq(Projects.id, project_id));
  });
}
