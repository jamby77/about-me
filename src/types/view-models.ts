export interface PortfolioBasics {
  name: string
  title: string
  image: string
  email: string | null
  phone: string | null
  location: string | null
  website: string | null
  linkedin: string | null
  github: string | null
  twitter: string | null
  description: string | null
}

export interface PortfolioExperienceItem {
  id: number
  name: string | null
  title: string | null
  role: string | null
  url: string | null
  startDate: string
  endDate: string | null
  description: string | null
  responsibilities: string[] | null
  achievements: string[] | null
  skills: string[] | null
  location: string | null
  locationType: string | null
}

export interface PortfolioEducationItem {
  id: number
  name: string | null
  degree: string | null
  field: string | null
  url: string | null
  startDate: string
  endDate: string | null
}

export interface PortfolioCertificateItem {
  id: number
  name: string | null
  description: string | null
  url: string | null
  date: string | null
}

export interface PortfolioProjectItem {
  id: number
  name: string | null
  description: string | null
  url: string | null
  repoUrl: string | null
  image: string | null
}

export interface PortfolioSkillItem {
  id: number
  name: string
}

export interface PortfolioViewModel {
  basics: PortfolioBasics
  work: PortfolioExperienceItem[]
  education: PortfolioEducationItem[]
  certificates: PortfolioCertificateItem[]
  projects: PortfolioProjectItem[]
  skills: PortfolioSkillItem[]
}

export interface AdminCurrentUser {
  name?: string | null
  email?: string | null
  image?: string | null
}

export interface AdminUserSummary {
  id: number
  name: string
  email: string | null
  image: string | null
}

export type AdminTabId =
  | "basic"
  | "personal"
  | "image"
  | "education"
  | "experience"
  | "certificates"
  | "projects"
  | "skills"
  | "languages"

export interface AdminTab {
  id: AdminTabId
  label: string
}

export interface AdminUserRow {
  id: number
  firstName: string | null
  lastName: string | null
  email: string | null
}

export interface AdminPersonalInfo {
  title: string | null
  image: string | null
  phone: string | null
  location: string | null
  website: string | null
  linkedin: string | null
  github: string | null
  twitter: string | null
  description: string | null
}

export interface AdminEducationItem {
  id: number
  name: string | null
  degree: string | null
  field: string | null
  url: string | null
  startDate: string
  endDate: string | null
}

export interface AdminCertificateItem {
  id: number
  name: string | null
  description: string | null
  url: string | null
  date: string | null
}

export interface AdminProjectItem {
  id: number
  name: string | null
  description: string | null
  url: string | null
  repoUrl: string | null
  date: string | null
  image: string | null
}

export interface AdminSkillItem {
  id: number
  name: string
}

export interface AdminLanguageOption {
  id: number
  language: string
  abbr: string
}

export interface AdminUserLanguageItem {
  id: number
  languageId: number
}

export interface AdminUserEditorViewModel {
  userId: number
  user: AdminUserRow
  tabs: AdminTab[]
  activeTab: AdminTabId
  errorByTab: Partial<Record<AdminTabId, string>>
  enableUploads: boolean
  personalInfo: AdminPersonalInfo | null
  education: AdminEducationItem[]
  experience: PortfolioExperienceItem[]
  certificates: AdminCertificateItem[]
  projects: AdminProjectItem[]
  skills: AdminSkillItem[]
  languageOptions: AdminLanguageOption[]
  userLanguages: AdminUserLanguageItem[]
  editIds: {
    education?: number
    experience?: number
    certificates?: number
    projects?: number
  }
}
