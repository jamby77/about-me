import type {
  AdminCertificateItem,
  AdminCurrentUser,
  AdminEducationItem,
  AdminLanguageOption,
  AdminProjectItem,
  AdminSkillItem,
  AdminTab,
  AdminTabId,
  AdminUserEditorViewModel,
  AdminUserLanguageItem,
  AdminUserRow,
  AdminUserSummary,
  PortfolioBasics,
  PortfolioCertificateItem,
  PortfolioEducationItem,
  PortfolioExperienceItem,
  PortfolioProjectItem,
  PortfolioSkillItem,
  PortfolioViewModel,
} from "@/types/view-models"
import { parseExperienceRows } from "@/lib/schemas"

export function toDateString(value: unknown): string | null {
  if (!value) return null

  const date = value instanceof Date ? value : new Date(value as string)
  if (Number.isNaN(date.getTime())) return null

  return date.toISOString()
}

export function getAdminTabs(enableUploads: boolean): AdminTab[] {
  return [
    { id: "basic", label: "Basic Info" },
    { id: "personal", label: "Personal Info" },
    ...(enableUploads ? [{ id: "image", label: "Image" } satisfies AdminTab] : []),
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience" },
    { id: "certificates", label: "Certificates" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "languages", label: "Languages" },
  ]
}

export function buildPortfolioViewModel(input: {
  basics: PortfolioBasics
  work: unknown
  education: Array<{
    id: number
    name: string | null
    degree: string | null
    field: string | null
    url: string | null
    start_date: Date | string
    end_date: Date | string | null
  }>
  certificates: Array<{
    id: number
    name: string | null
    description: string | null
    url: string | null
    date: Date | string | null
  }>
  projects: Array<{
    id: number
    name: string | null
    description: string | null
    url: string | null
    repoUrl: string | null
    image: string | null
  }>
  skills: Array<{ id: number; name: string }>
}): PortfolioViewModel {
  const work: PortfolioExperienceItem[] = parseExperienceRows(input.work).map((item) => ({
    id: item.id,
    name: item.name,
    title: item.title,
    role: item.role,
    url: item.url,
    startDate: toDateString(item.start_date) ?? new Date().toISOString(),
    endDate: toDateString(item.end_date),
    description: item.description,
    responsibilities: item.responsibilities ?? null,
    achievements: item.achievements ?? null,
    skills: item.skills ?? null,
    location: item.location ?? null,
    locationType: item.location_type ?? null,
  }))

  const education: PortfolioEducationItem[] = input.education.map((item) => ({
    id: item.id,
    name: item.name,
    degree: item.degree,
    field: item.field,
    url: item.url,
    startDate: toDateString(item.start_date) ?? new Date().toISOString(),
    endDate: toDateString(item.end_date),
  }))

  const certificates: PortfolioCertificateItem[] = input.certificates.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    url: item.url,
    date: toDateString(item.date),
  }))

  const projects: PortfolioProjectItem[] = input.projects.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    url: item.url,
    repoUrl: item.repoUrl,
    image: item.image,
  }))

  const skills: PortfolioSkillItem[] = input.skills.map((item) => ({
    id: item.id,
    name: item.name,
  }))

  return {
    basics: input.basics,
    work,
    education,
    certificates,
    projects,
    skills,
  }
}

export function buildAdminUsers(users: AdminUserSummary[]): AdminUserSummary[] {
  return users
}

export function buildAdminUserEditorViewModel(input: {
  userId: number
  user: AdminUserRow
  tabs: AdminTab[]
  activeTab: AdminTabId
  errorByTab: Partial<Record<AdminTabId, string>>
  enableUploads: boolean
  personalInfo: AdminUserEditorViewModel["personalInfo"]
  education: Array<{
    id: number
    name: string | null
    degree: string | null
    field: string | null
    url: string | null
    start_date: Date | string
    end_date: Date | string | null
  }>
  experience: unknown
  certificates: Array<{
    id: number
    name: string | null
    description: string | null
    url: string | null
    date: Date | string | null
  }>
  projects: Array<{
    id: number
    name: string | null
    description: string | null
    url: string | null
    repoUrl: string | null
    date: Date | string | null
    image: string | null
  }>
  skills: AdminSkillItem[]
  languageOptions: AdminLanguageOption[]
  userLanguages: Array<{ id: number; language_id: number }>
  editIds: AdminUserEditorViewModel["editIds"]
}): AdminUserEditorViewModel {
  const education: AdminEducationItem[] = input.education.map((item) => ({
    id: item.id,
    name: item.name,
    degree: item.degree,
    field: item.field,
    url: item.url,
    startDate: toDateString(item.start_date) ?? new Date().toISOString(),
    endDate: toDateString(item.end_date),
  }))

  const experience = parseExperienceRows(input.experience).map((item) => ({
    id: item.id,
    name: item.name,
    title: item.title,
    role: item.role,
    url: item.url,
    startDate: toDateString(item.start_date) ?? new Date().toISOString(),
    endDate: toDateString(item.end_date),
    description: item.description,
    responsibilities: item.responsibilities ?? null,
    achievements: item.achievements ?? null,
    skills: item.skills ?? null,
    location: item.location ?? null,
    locationType: item.location_type ?? null,
  }))

  const certificates: AdminCertificateItem[] = input.certificates.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    url: item.url,
    date: toDateString(item.date),
  }))

  const projects: AdminProjectItem[] = input.projects.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    url: item.url,
    repoUrl: item.repoUrl,
    date: toDateString(item.date),
    image: item.image,
  }))

  const userLanguages: AdminUserLanguageItem[] = input.userLanguages.map((item) => ({
    id: item.id,
    languageId: item.language_id,
  }))

  return {
    userId: input.userId,
    user: input.user,
    tabs: input.tabs,
    activeTab: input.activeTab,
    errorByTab: input.errorByTab,
    enableUploads: input.enableUploads,
    personalInfo: input.personalInfo,
    education,
    experience,
    certificates,
    projects,
    skills: input.skills,
    languageOptions: input.languageOptions,
    userLanguages,
    editIds: input.editIds,
  }
}

export function getCurrentUserDisplay(user: AdminCurrentUser | null | undefined) {
  return user ?? null
}
