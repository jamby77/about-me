import { z } from "zod";
import {
  db,
  users as Users,
  personal_info as PersonalInfo,
  education as Education,
  experience as Experience,
  certificates as Certificates,
  projects as Projects,
  languages as Languages,
  user_languages as UserLanguages,
  skills as Skills,
  eq,
} from "astro:db";
import { Buffer } from "node:buffer";
import sharp from "sharp";
import { ENABLE_UPLOADS } from "@/lib/flags";
import {
  OptionalDate,
  RequiredDate,
  RequiredTrimmed,
  OptionalTrimmed,
  IdNumber,
  OptionalUrl,
} from "@/lib/schemas.ts";

// Result helpers
type ActionResult = { ok: true } | { ok: false; error: string };
const ok = (): ActionResult => ({ ok: true });
const fail = (msg: string): ActionResult => ({ ok: false, error: msg });
async function withTry(
  action: string,
  fn: () => Promise<void>,
): Promise<ActionResult> {
  try {
    await fn();
    return ok();
  } catch (e: any) {
    console.error(`[adminUserActions] ${action} failed`, e);
    const msg = typeof e?.message === "string" ? e.message : "Unexpected error";
    return fail(msg);
  }
}

type DataUrlResult = { ok: true; dataUrl: string } | { ok: false; error: string };
async function imageDataUrlFromForm(
  form: FormData,
  fieldName: string,
  maxBytes = 5 * 1024 * 1024,
): Promise<DataUrlResult> {
  const file = form.get(fieldName);
  if (!file || !(file instanceof File)) {
    return { ok: false, error: "No file uploaded" };
  }
  const size = (file as File).size || 0;
  if (size > maxBytes) {
    return { ok: false, error: "Image too large (max 5MB)" };
  }
  const arr = new Uint8Array(await (file as File).arrayBuffer());
  const input = Buffer.from(arr);
  let meta;
  try {
    meta = await sharp(input).metadata();
  } catch {
    return { ok: false, error: "Invalid image file" };
  }
  // Allow common photo formats; explicitly exclude SVG/GIF and avoid HEIF for compatibility
  const allowed = new Set(["jpeg", "jpg", "png", "webp", "avif"]);
  const fmt = (meta.format || "").toLowerCase();
  if (!allowed.has(fmt)) {
    return { ok: false, error: "Unsupported image format" };
  }
  // Re-encode to WebP for consistency and smaller size
  let out: Buffer;
  try {
    out = await sharp(input)
      .rotate() // respect EXIF orientation
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .withMetadata({ density: 300 }) // cap density metadata to 300 DPI where supported
      .toBuffer();
  } catch {
    return { ok: false, error: "Failed to process image" };
  }
  const base64 = out.toString("base64");
  const mime = "image/webp";
  const dataUrl = `data:${mime};base64,${base64}`;
  return { ok: true, dataUrl };
}

// Action functions
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
    await db.delete(PersonalInfo).where(eq(PersonalInfo.user_id, userId));
    await db.insert(PersonalInfo).values({
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
    });
  });
}

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
  let fromEntries = Object.fromEntries(form.entries());
  console.log({ fromEntries });
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
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
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
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
  const { id } = data;
  return withTry("delete_experience", async () => {
    await db.delete(Experience).where(eq(Experience.id, id));
  });
}

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
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
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
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
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
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
  const { id } = data;
  return withTry("delete_certificate", async () => {
    await db.delete(Certificates).where(eq(Certificates.id, id));
  });
}

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
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
  const { name, description, url, repoUrl, date, image } = data;
  return withTry("add_project", async () => {
    await db
      .insert(Projects)
      .values({ user_id: userId, name, description, url, repoUrl, date, image });
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
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
  const { id, name, description, url, repoUrl, date, image } = data;
  return withTry("update_project", async () => {
    await db
      .update(Projects)
      .set({ name, description, url, repoUrl, date, image })
      .where(eq(Projects.id, id));
  });
}

export async function uploadProjectImage(
  userId: number,
  form: FormData,
): Promise<ActionResult> {
  if (!ENABLE_UPLOADS) return fail("Uploads are disabled");
  const idRes = z.object({ project_id: IdNumber }).safeParse(
    Object.fromEntries(form.entries()),
  );
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

export async function deleteProject(
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
  return withTry("delete_project", async () => {
    await db.delete(Projects).where(eq(Projects.id, id));
  });
}

export async function addSkill(
  userId: number,
  form: FormData,
): Promise<ActionResult> {
  const schema = z.object({ name: RequiredTrimmed });
  const { success, error, data } = schema.safeParse(
    Object.fromEntries(form.entries()),
  );
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
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
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
  const { id } = data;
  return withTry("delete_skill", async () => {
    await db.delete(Skills).where(eq(Skills.id, id));
  });
}

export async function addLanguage(
  userId: number,
  form: FormData,
): Promise<ActionResult> {
  const { success, error, data } = z
    .object({ language_id: IdNumber })
    .safeParse(Object.fromEntries(form.entries()));
  if (!success) {
    return fail(z.prettifyError(error) ?? "Invalid input");
  }
  const { language_id } = data;
  return withTry("add_language", async () => {
    await db.insert(UserLanguages).values({ user_id: userId, language_id });
  });
}

export async function deleteLanguage(
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
  return withTry("delete_language", async () => {
    await db.delete(UserLanguages).where(eq(UserLanguages.id, id));
  });
}

// Upload user image and store it under public/uploads/users/:id
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
    // Upsert personal_info.image
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
      await db.insert(PersonalInfo).values({ user_id: userId, image: res.dataUrl });
    }
  });
}

export async function handleAdminUserPost(
  userId: number,
  form: FormData,
): Promise<{ action: string; error?: string }> {
  const action = String(form.get("_action") || "");
  let res: ActionResult;
  switch (action) {
    case "update_user_basic":
      res = await updateUserBasic(userId, form);
      break;
    case "upsert_personal_info":
      res = await upsertPersonalInfo(userId, form);
      break;
    case "add_education":
      res = await addEducation(userId, form);
      break;
    case "update_education":
      res = await updateEducation(userId, form);
      break;
    case "delete_education":
      res = await deleteEducation(userId, form);
      break;
    case "add_experience":
      res = await addExperience(userId, form);
      break;
    case "update_experience":
      res = await updateExperience(userId, form);
      break;
    case "delete_experience":
      res = await deleteExperience(userId, form);
      break;
    case "add_certificate":
      res = await addCertificate(userId, form);
      break;
    case "update_certificate":
      res = await updateCertificate(userId, form);
      break;
    case "delete_certificate":
      res = await deleteCertificate(userId, form);
      break;
    case "add_project":
      res = await addProject(userId, form);
      break;
    case "update_project":
      res = await updateProject(userId, form);
      break;
    case "delete_project":
      res = await deleteProject(userId, form);
      break;
    case "upload_project_image":
      res = await uploadProjectImage(userId, form);
      break;
    case "add_skill":
      res = await addSkill(userId, form);
      break;
    case "delete_skill":
      res = await deleteSkill(userId, form);
      break;
    case "add_language":
      res = await addLanguage(userId, form);
      break;
    case "delete_language":
      res = await deleteLanguage(userId, form);
      break;
    case "upload_user_image":
      res = await uploadUserImage(userId, form);
      break;
    default:
      return { action, error: "Invalid action" };
  }
  return { action, error: res.ok ? undefined : res.error };
}
