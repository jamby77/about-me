import {
  db,
  users,
  experience,
  education,
  personal_info,
  languages,
  certificates,
  skills,
  user_languages,
  projects,
  user,
  session,
  account,
  verification,
} from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(users).values({
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "pKj9w@example.com",
  });

  await db.insert(user).values({
    id: "1",
    name: "John Doe",
    email: "pKj9w@example.com",
    image: "/assets/images/me.jpeg",
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(account).values({
    id: "1",
    userId: "1",
    accountId: "1",
    providerId: "1",
    accessToken: "1",
    refreshToken: "1",
    accessTokenExpiresAt: new Date(),
    refreshTokenExpiresAt: new Date(),
    scope: "1",
    idToken: "1",
    password: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(session).values({
    id: "1",
    userId: "1",
    token: "1",
    expiresAt: new Date(),
    ipAddress: "1",
    userAgent: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(verification).values({
    id: "1",
    identifier: "1",
    value: "1",
    expiresAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(personal_info).values({
    user_id: 1,
    image: "/assets/images/me.jpeg",
    title: "Software Engineer",
    phone: "123-456-7890",
    location: "New York, NY",
    website: "https://johndoe.com",
    linkedin: "https://linkedin.com/johndoe",
    github: "https://github.com/johndoe",
    twitter: "https://twitter.com/johndoe",
    description:
      "I'm a software engineer with experience in React, Next.js, and Node.js.",
  });

  await db.insert(education).values([
    {
      user_id: 1,
      name: "University A",
      degree: "Bachelor",
      field: "Computer Science",
      start_date: new Date("2020-09-01"),
      end_date: new Date("2024-06-30"),
    },
    {
      user_id: 1,
      name: "High School B",
      degree: "High School Diploma",
      start_date: new Date("2016-09-01"),
      end_date: new Date("2020-06-30"),
    },
  ]);

  await db.insert(experience).values([
    {
      user_id: 1,
      name: "Company A",
      title: "Software Engineer",
      role: "Frontend Developer",
      start_date: new Date("2022-01-01"),
      end_date: new Date("2023-12-31"),
      description:
        "Worked on a web application using React, Next.js, and Node.js. I'm a software engineer with experience in React, Next.js, and Node.js.",
      responsibilities: [
        "Collaborated with senior developers to design and implement web applications using modern JavaScript frameworks.",
        "Assisted in debugging and optimizing front-end code to ensure smooth user experiences.",
        "Participated in code reviews and contributed to improving coding standards within the team.",
      ],
      achievements: [
        "Developing and maintaining web applications using JavaScript, HTML, and CSS. Collaborating with the team to implement new features and fix bugs.",
      ],
      skills: ["React", "Tailwind", "GitHub"],
      location: "Sofia, Bulgaria",
      location_type: "Remote",
    },
    {
      user_id: 1,
      name: "Company B",
      title: "Senior Software Engineer",
      role: "Backend Developer",
      start_date: new Date("2023-01-01"),
      description:
        "Work experience in Python, Django, and SQL. I'm a software engineer with experience in React, Next.js, and Node.js.",
      responsibilities: [
        "Developed and maintained backend services using Python and Django.",
        "Worked closely with front-end developers to integrate user-facing elements with server-side logic.",
        "Participated in daily stand-ups and bi-weekly sprint planning meetings to ensure alignment with project goals.",
      ],
      achievements: [
        "Successfully implemented a feature that enhanced user authentication, improving security measures.",
      ],
      skills: ["Python", "Django", "SQL", "Git"],
      location: "New York, NY",
      location_type: "On site",
    },
  ]);

  await db.insert(languages).values([
    {
      language: "Spanish",
      abbr: "es",
    },
    {
      language: "English",
      abbr: "en",
    },
    {
      language: "German",
      abbr: "de",
    },
    {
      language: "France",
      abbr: "fr",
    },
    {
      language: "Italian",
      abbr: "it",
    },
    {
      language: "Korean",
      abbr: "ko",
    },
    {
      language: "Portuguese",
      abbr: "pt",
    },
    {
      language: "Chinese",
      abbr: "zh",
    },
    {
      language: "Japanese",
      abbr: "ja",
    },
    {
      language: "Arabic",
      abbr: "ar",
    },
    {
      language: "Dutch",
      abbr: "nl",
    },
    {
      language: "Finnish",
      abbr: "fi",
    },
    {
      language: "Russian",
      abbr: "ru",
    },
    {
      language: "Turkish",
      abbr: "tr",
    },
    {
      language: "Hindi",
      abbr: "hi",
    },
    {
      language: "Bengali",
      abbr: "bn",
    },
    {
      language: "Bulgarian",
      abbr: "bg",
    },
  ]);
  await db.insert(user_languages).values([
    {
      user_id: 1,
      language_id: 2,
    },
    {
      user_id: 1,
      language_id: 13,
    },
    {
      user_id: 1,
      language_id: 17,
    },
  ]);
  await db.insert(certificates).values([
    {
      user_id: 1,
      name: "Full Stack Web Development",
      date: new Date("2023-05-01"),
      description: "Online University",
      url: "https://onlineuniversity.com/certificates/fullstack",
    },
  ]);

  await db.insert(skills).values([
    {
      user_id: 1,
      name: "Figma",
    },
    {
      user_id: 1,
      name: "Gitlab",
    },
    {
      user_id: 1,
      name: "HTML",
    },
    {
      user_id: 1,
      name: "CSS",
    },
    {
      user_id: 1,
      name: "JavaScript",
    },
    {
      user_id: 1,
      name: "Tailwind",
    },
    {
      user_id: 1,
      name: "TypeScript",
    },
    {
      user_id: 1,
      name: "Node",
    },
    {
      user_id: 1,
      name: "MySQL",
    },
    {
      user_id: 1,
      name: "Git",
    },
    {
      user_id: 1,
      name: "GitHub",
    },
    {
      user_id: 1,
      name: "Next.js",
    },
    {
      user_id: 1,
      name: "React",
    },
  ]);

  await db.insert(projects).values([
    {
      user_id: 1,
      name: "Personal Portfolio",
      description:
        "A personal portfolio website to showcase my projects and skills.",
      url: "https://johndoe.dev",
      repoUrl: "https://github.com",
      date: new Date("2023-05-01"),
    },
    {
      user_id: 1,
      name: "Weather App",
      description:
        "A web application that provides weather information for any location.",
      url: "https://weatherapp.com",
      date: new Date("2023-05-01"),
    },
    {
      user_id: 1,
      name: "Task Manager",
      description: "A simple task management app to keep track of daily tasks.",
      url: "https://taskmanager.com",
      repoUrl: "https://github.com",
      date: new Date("2023-05-01"),
    },
    {
      user_id: 1,
      name: "E-commerce Site",
      description:
        "An online store built with Next.js and Stripe for payment processing.",
      url: "https://ecommerce.com",
      date: new Date("2023-05-01"),
    },
  ]);
}
