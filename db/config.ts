import { column, defineDb, defineTable } from "astro:db";

const users = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    first_name: column.text(),
    last_name: column.text(),
    email: column.text({ unique: true }),
  },
});

const personal_info = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    user_id: column.number({ references: () => users.columns.id }),
    image: column.text({ optional: true }),
    title: column.text({ optional: true }),
    phone: column.text({ optional: true }),
    location: column.text({ optional: true }),
    website: column.text({ optional: true }),
    linkedin: column.text({ optional: true }),
    github: column.text({ optional: true }),
    twitter: column.text({ optional: true }),
    description: column.text({ optional: true }),
  },
});

const education = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    user_id: column.number({ references: () => users.columns.id }),
    name: column.text(),
    url: column.text({ optional: true }),
    degree: column.text(),
    field: column.text({ optional: true }),
    start_date: column.date(),
    end_date: column.date({ optional: true }),
  },
});

const experience = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    user_id: column.number({ references: () => users.columns.id }),
    name: column.text(),
    title: column.text(),
    role: column.text(),
    url: column.text({ optional: true }),
    start_date: column.date(),
    end_date: column.date({ optional: true }),
    description: column.text({ optional: true }),
    responsibilities: column.json({ optional: true }),
    achievements: column.json({ optional: true }),
    skills: column.json({ optional: true }),
    location_type: column.text({ optional: true }),
    location: column.text({ optional: true }),
  },
});

const skills = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    user_id: column.number({ references: () => users.columns.id }),
    name: column.text({ unique: true }),
  },
});

const certificates = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    user_id: column.number({ references: () => users.columns.id }),
    name: column.text({ unique: true }),
    date: column.date({ optional: true }),
    description: column.text({ optional: true }),
    url: column.text({ optional: true }),
  },
});

const projects = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    user_id: column.number({ references: () => users.columns.id }),
    name: column.text({ unique: true }),
    description: column.text({ optional: true }),
    url: column.text({ optional: true }),
    repoUrl: column.text({ optional: true }),
    date: column.date({ optional: true }),
  },
});

const languages = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    language: column.text(),
    abbr: column.text(),
  },
});

const user_languages = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    user_id: column.number(),
    language_id: column.number(),
  },
  indexes: [
    {
      on: ["user_id", "language_id"],
      unique: true,
    },
  ],
  foreignKeys: [
    {
      columns: ["user_id"],
      references: () => [users.columns.id],
    },
    {
      columns: ["language_id"],
      references: () => [languages.columns.id],
    },
  ],
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    users,
    education,
    personal_info,
    experience,
    skills,
    certificates,
    projects,
    languages,
    user_languages,
  },
});
