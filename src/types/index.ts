export interface CV {
  basics: User & UserInfo;
  work: Array<Work>;
  education: Array<Education>;
  certificates: Array<Certificates>;
  skills: Array<Skills>;
  languages: Array<Languages>;
  projects: Array<Projects>;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface UserInfo {
  id: number;
  title: string;
  image: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  twitter: string;
  description: string;
}

interface Work {
  id: number;
  name: string;
  title: string;
  role: string;
  url: string;
  start_date: DateStr | Date;
  end_date: DateStr | Date | null;
  description: string;
}

type DateStr = `${string}-${string}-${string}`;

interface Skills {
  id: number;
  name: string;
}

interface Certificates {
  id: number;
  name: string;
  date: DateStr | Date | null;
  description: string;
  url: string;
}

interface Education {
  id: number;
  name: string;
  url: string;
  degree: string;
  field: string;
  start_date: DateStr | Date;
  end_date: DateStr | Date | null;
}

interface Languages {
  language: Language;
  fluency: string;
}

type Language =
  | "Spanish"
  | "English"
  | "German"
  | "France"
  | "Italian"
  | "Korean"
  | "Portuguese"
  | "Chinese"
  | "Arabic"
  | "Dutch"
  | "Finnish"
  | "Russian"
  | "Turkish"
  | "Hindi"
  | "Bengali"
  | string;

interface Projects {
  name: string;
  description: string;
  url: string;
  repoUrl?: string;
  date?: string;
}

export type SocialIcon = Record<string, string | any>;
