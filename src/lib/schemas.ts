import { z } from "zod";

// DB row shape (loose) for runtime parsing from astro:db
const ExperienceDbRowSchema = z.object({
  id: z.number(),
  name: z.string().nullable().optional().default(null),
  title: z.string().nullable().optional().default(null),
  role: z.string().nullable().optional().default(null),
  url: z.string().nullable().optional().default(null),
  start_date: z.date(),
  end_date: z.date().optional().nullable().default(null),
  description: z.string().nullable().optional().default(null),
  location_type: z.string().nullable().optional().default(null),
  location: z.string().nullable().optional().default(null),
  // JSON fields come back as unknown
  skills: z.array(z.string()).optional().nullable(),
  responsibilities: z.array(z.string()).optional().nullable(),
  achievements: z.array(z.string()).optional().nullable(),
});

export type ExperienceItem = z.infer<typeof ExperienceDbRowSchema>;

export function parseExperienceRows(rows: unknown): ExperienceItem[] {
  return z.array(ExperienceDbRowSchema).parse(rows);
}

// Date validators: not in the future and not older than 100 years
const isValidDate = (d: Date | undefined) =>
  d instanceof Date && !isNaN(d.getTime());

const withinLast100Years = (d: Date) => {
  const now = new Date();
  if (d > now) return false;
  const hundredYearsAgo = new Date(now);
  hundredYearsAgo.setFullYear(now.getFullYear() - 100);
  return d >= hundredYearsAgo;
};
// Zod helpers
export const OptionalTrimmed = z.string().trim().optional();
export const RequiredTrimmed = z
  .string()
  .trim()
  .min(1, { message: "Field is required" });

export const OptionalDate = z.coerce
  .date()
  .optional()
  .refine((d) => d === undefined || isValidDate(d), { message: "Invalid date" })
  .refine((d) => d === undefined || withinLast100Years(d), {
    message: "Date must be within the last 100 years and not in the future",
  });

export const RequiredDate = z.coerce
  .date()
  .refine((d) => isValidDate(d), { message: "Invalid date" })
  .refine((d) => withinLast100Years(d), {
    message: "Date must be within the last 100 years and not in the future",
  });

export const IdNumber = z.coerce
  .number()
  .refine((n) => Number.isFinite(n), { message: "Invalid id" });
