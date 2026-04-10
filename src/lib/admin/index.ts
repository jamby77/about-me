export * from "./utils";
export * from "./images";
export * from "./users";
export * from "./personal";
export * from "./education";
export * from "./experience";
export * from "./certificates";
export * from "./projects";
export * from "./skills";
export * from "./user-languages";

import type { ActionResult } from "./utils";
import type { AdminTabId } from "@/types/view-models";

// Single source of truth mapping each admin form _action to the tab it
// belongs to. Used by the admin page to route validation errors back to
// the right tab, and by the dispatch switch below to keep the two in sync.
export const ADMIN_ACTION_TO_TAB = {
  update_user_basic: "basic",
  upsert_personal_info: "personal",
  upload_user_image: "image",
  add_education: "education",
  update_education: "education",
  delete_education: "education",
  add_experience: "experience",
  update_experience: "experience",
  delete_experience: "experience",
  add_certificate: "certificates",
  update_certificate: "certificates",
  delete_certificate: "certificates",
  add_project: "projects",
  update_project: "projects",
  delete_project: "projects",
  upload_project_image: "projects",
  add_skill: "skills",
  delete_skill: "skills",
  add_language: "languages",
  delete_language: "languages",
} as const satisfies Record<string, AdminTabId>;

export type AdminAction = keyof typeof ADMIN_ACTION_TO_TAB;

// Import handlers without aliases for clarity
import { updateUserBasic } from "./users";
import { upsertPersonalInfo, uploadUserImage } from "./personal";
import { addEducation, updateEducation, deleteEducation } from "./education";
import {
  addExperience,
  updateExperience,
  deleteExperience,
} from "./experience";
import {
  addCertificate,
  updateCertificate,
  deleteCertificate,
} from "./certificates";
import {
  addProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
} from "./projects";
import { addSkill, deleteSkill } from "./skills";
import { addUserLanguage, deleteUserLanguage } from "./user-languages";

export type AdminPostResult = {
  action: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function handleAdminUserPost(
  userId: number,
  form: FormData,
): Promise<AdminPostResult> {
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
      res = await addUserLanguage(userId, form);
      break;
    case "delete_language":
      res = await deleteUserLanguage(userId, form);
      break;
    case "upload_user_image":
      res = await uploadUserImage(userId, form);
      break;
    default:
      return { action, error: "Invalid action" };
  }
  if (res.ok) return { action };
  return { action, error: res.error, fieldErrors: res.fieldErrors };
}
