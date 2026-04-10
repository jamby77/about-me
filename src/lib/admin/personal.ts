import { z } from "zod";
import { db, personal_info as PersonalInfo, eq } from "astro:db";
import { ENABLE_UPLOADS } from "@/lib/flags.ts";
import { imageDataUrlFromForm } from "./images.ts";
import { type ActionResult, fail, withTry } from "./utils.ts";
import { OptionalTrimmed, RequiredTrimmed } from "@/lib/schemas.ts";

export async function upsertPersonalInfo(
  userId: number,
  form: FormData,
): Promise<ActionResult> {
  const schema = z.object({
    image: OptionalTrimmed,
    title: RequiredTrimmed,
    phone: RequiredTrimmed,
    location: RequiredTrimmed,
    website: OptionalTrimmed,
    linkedin: OptionalTrimmed,
    github: OptionalTrimmed,
    twitter: OptionalTrimmed,
    description: RequiredTrimmed,
  });
  const { success, error, data } = schema.safeParse(
    Object.fromEntries(form.entries()),
  );
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
  const {
    image,
    title,
    phone,
    location,
    website,
    linkedin,
    github,
    twitter,
    description,
  } = data;
  return withTry("upsert_personal_info", async () => {
    // Atomic delete-then-insert via libsql batch. If the insert fails the
    // delete is rolled back, so the user never ends up with no personal_info
    // row mid-flight.
    await db.batch([
      db.delete(PersonalInfo).where(eq(PersonalInfo.user_id, userId)),
      db.insert(PersonalInfo).values({
        user_id: userId,
        image,
        title,
        phone,
        location,
        website,
        linkedin,
        github,
        twitter,
        description,
      }),
    ]);
  });
}

export async function uploadUserImage(
  userId: number,
  form: FormData,
): Promise<ActionResult> {
  if (!ENABLE_UPLOADS) {
    return fail("Uploads are disabled");
  }
  const res = await imageDataUrlFromForm(form, "image_file");
  if (!res.ok) return res;
  return withTry("upload_user_image", async () => {
    const [existing] = await db
      .select()
      .from(PersonalInfo)
      .where(eq(PersonalInfo.user_id, userId));
    if (existing) {
      await db
        .update(PersonalInfo)
        .set({ image: res.dataUrl })
        .where(eq(PersonalInfo.user_id, userId));
    } else {
      await db
        .insert(PersonalInfo)
        .values({ user_id: userId, image: res.dataUrl });
    }
  });
}
