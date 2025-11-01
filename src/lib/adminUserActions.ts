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

// Helpers
const getString = (form: FormData, key: string) => {
  const v = String(form.get(key) ?? "").trim();
  return v.length ? v : undefined;
};
const getNumber = (form: FormData, key: string) => {
  const n = Number(form.get(key));
  return Number.isFinite(n) ? n : undefined;
};
const getDate = (form: FormData, key: string) => {
  const v = form.get(key);
  if (!v) return undefined;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? undefined : d;
};

// Action functions
export async function updateUserBasic(userId: number, form: FormData) {
  const first_name = getString(form, "first_name");
  const last_name = getString(form, "last_name");
  const email = getString(form, "email");
  await db.update(Users).set({ first_name, last_name, email }).where(eq(Users.id, userId));
}

export async function upsertPersonalInfo(userId: number, form: FormData) {
  const image = getString(form, "image") ?? null;
  const title = getString(form, "title") ?? null;
  const phone = getString(form, "phone") ?? null;
  const location = getString(form, "location") ?? null;
  const website = getString(form, "website") ?? null;
  const linkedin = getString(form, "linkedin") ?? null;
  const github = getString(form, "github") ?? null;
  const twitter = getString(form, "twitter") ?? null;
  const description = getString(form, "description") ?? null;

  await db.delete(PersonalInfo).where(eq(PersonalInfo.user_id, userId));
  await db.insert(PersonalInfo).values({
    user_id: userId,
    image: image || undefined,
    title: title || undefined,
    phone: phone || undefined,
    location: location || undefined,
    website: website || undefined,
    linkedin: linkedin || undefined,
    github: github || undefined,
    twitter: twitter || undefined,
    description: description || undefined,
  });
}

export async function addEducation(userId: number, form: FormData) {
  const name = getString(form, "name");
  const degree = getString(form, "degree");
  const field = getString(form, "field");
  const start_date = getDate(form, "start_date");
  const end_date = getDate(form, "end_date");
  const url = getString(form, "url");
  if (!name || !degree || !start_date) return;
  await db.insert(Education).values({ user_id: userId, name, degree, field, start_date, end_date, url });
}

export async function deleteEducation(_userId: number, form: FormData) {
  const id = getNumber(form, "id");
  if (id !== undefined) await db.delete(Education).where(eq(Education.id, id));
}

export async function addExperience(userId: number, form: FormData) {
  const name = getString(form, "name");
  const title = getString(form, "title");
  const role = getString(form, "role");
  const url = getString(form, "url");
  const start_date = getDate(form, "start_date");
  const end_date = getDate(form, "end_date");
  const description = getString(form, "description");
  const location = getString(form, "location");
  const location_type = getString(form, "location_type");

  const skills = (form.getAll("skills") || [])
    .map((v) => String(v).trim())
    .filter(Boolean);
  const respRaw = getString(form, "responsibilities") || "";
  const responsibilities = respRaw
    ? respRaw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
    : undefined;
  const achRaw = getString(form, "achievements") || "";
  const achievements = achRaw
    ? achRaw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
    : undefined;

  if (!name || !title || !role || !start_date) return;
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
    skills: skills.length ? skills : undefined,
    responsibilities,
    achievements,
  });
}

export async function deleteExperience(_userId: number, form: FormData) {
  const id = getNumber(form, "id");
  if (id !== undefined) await db.delete(Experience).where(eq(Experience.id, id));
}

export async function addCertificate(userId: number, form: FormData) {
  const name = getString(form, "name");
  const date = getDate(form, "date");
  const description = getString(form, "description");
  const url = getString(form, "url");
  if (!name) return;
  await db.insert(Certificates).values({ user_id: userId, name, date, description, url });
}

export async function deleteCertificate(_userId: number, form: FormData) {
  const id = getNumber(form, "id");
  if (id !== undefined) await db.delete(Certificates).where(eq(Certificates.id, id));
}

export async function addProject(userId: number, form: FormData) {
  const name = getString(form, "name");
  const description = getString(form, "description");
  const url = getString(form, "url");
  const repoUrl = getString(form, "repoUrl");
  const date = getDate(form, "date");
  if (!name) return;
  await db.insert(Projects).values({ user_id: userId, name, description, url, repoUrl, date });
}

export async function deleteProject(_userId: number, form: FormData) {
  const id = getNumber(form, "id");
  if (id !== undefined) await db.delete(Projects).where(eq(Projects.id, id));
}

export async function addSkill(userId: number, form: FormData) {
  const name = getString(form, "name");
  if (!name) return;
  await db.insert(Skills).values({ user_id: userId, name });
}

export async function deleteSkill(_userId: number, form: FormData) {
  const id = getNumber(form, "id");
  if (id !== undefined) await db.delete(Skills).where(eq(Skills.id, id));
}

export async function addLanguage(userId: number, form: FormData) {
  const language_id = getNumber(form, "language_id");
  if (language_id === undefined) return;
  await db.insert(UserLanguages).values({ user_id: userId, language_id });
}

export async function deleteLanguage(_userId: number, form: FormData) {
  const id = getNumber(form, "id");
  if (id !== undefined) await db.delete(UserLanguages).where(eq(UserLanguages.id, id));
}

export async function handleAdminUserPost(userId: number, form: FormData) {
  const action = String(form.get("_action") || "");
  switch (action) {
    case "update_user_basic":
      return updateUserBasic(userId, form);
    case "upsert_personal_info":
      return upsertPersonalInfo(userId, form);
    case "add_education":
      return addEducation(userId, form);
    case "delete_education":
      return deleteEducation(userId, form);
    case "add_experience":
      return addExperience(userId, form);
    case "delete_experience":
      return deleteExperience(userId, form);
    case "add_certificate":
      return addCertificate(userId, form);
    case "delete_certificate":
      return deleteCertificate(userId, form);
    case "add_project":
      return addProject(userId, form);
    case "delete_project":
      return deleteProject(userId, form);
    case "add_skill":
      return addSkill(userId, form);
    case "delete_skill":
      return deleteSkill(userId, form);
    case "add_language":
      return addLanguage(userId, form);
    case "delete_language":
      return deleteLanguage(userId, form);
    default:
      return;
  }
}
