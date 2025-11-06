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

// Zod helpers
export const OptionalTrimmed = z.string().trim().optional();
export const RequiredTrimmed = z
  .string()
  .trim()
  .min(1, { message: "Field is required" });

const hundredYearsAgo = new Date();
hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);

export const OptionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.url().optional(),
);

export const OptionalDate = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce
    .date()
    .min(hundredYearsAgo, { message: "Date is too far in the past" })
    .max(new Date(), { message: "Date is in the future" })
    .optional(),
);

export const RequiredDate = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce
    .date()
    .min(hundredYearsAgo, { message: "Date is too far in the past" })
    .max(new Date(), { message: "Date is in the future" }),
);

export const IdNumber = z.coerce
  .number()
  .refine((n) => Number.isFinite(n), { message: "Invalid id" });
