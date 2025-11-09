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
    image: column.text({ optional: true }),
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

// better auth tables
/*
table: user
id	string	PK	Unique identifier for each user
name	string	-	User's chosen display name
email	string	-	User's email address for communication and login
emailVerified	boolean	-	Whether the user's email is verified
image	string	?	User's image url
createdAt	Date	-	Timestamp of when the user account was created
updatedAt	Date	-	Timestamp of the last update to the user's information
role	string	?	The user's role. Defaults to `user`. Admins will have the `admin` role.
banned	boolean	?	Indicates whether the user is banned.
banReason	string	?	The reason for the user's ban.
banExpires	date	?	The date when the user's ban will expire.
*/
const user = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
      label: "Unique identifier for each user",
    }),
    name: column.text({
      label: "User's chosen display name",
    }),
    email: column.text({
      unique: true,
      label: "User's email address for communication and login",
    }),
    emailVerified: column.boolean({
      default: false,
      label: "Whether the user's email is verified",
    }),
    role: column.text({
      optional: true,
      label:
        "The user's role. Defaults to `user`. Admins will have the `admin` role.",
      default: "user",
    }),
    banned: column.boolean({
      optional: true,
      label: "Indicates whether the user is banned.",
    }),
    banReason: column.text({
      optional: true,
      label: "The reason for the user's ban.",
    }),
    banExpires: column.date({
      optional: true,
      label: "The date when the user's ban will expire.",
    }),
    image: column.text({ optional: true, label: "User's image url" }),
    createdAt: column.date({
      label: "Timestamp of when the user account was created",
    }),
    updatedAt: column.date({
      optional: true,
      label: "Timestamp of the last update to the user's information",
    }),
  },
});

/*
table: session
id	string	PK	Unique identifier for each session
userId	string	FK	The ID of the user
token	string	-	The unique session token
expiresAt	Date	-	The time when the session expires
ipAddress	string	?	The IP address of the device
userAgent	string	?	The user agent information of the device
impersonatedBy	string	?	The ID of the admin that is impersonating this session.
createdAt	Date	-	Timestamp of when the session was created
updatedAt	Date	-	Timestamp of when the session was updated
*/
const session = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
      label: "Unique identifier for each session",
    }),
    userId: column.text({
      label: "The ID of the user",
      references: () => user.columns.id,
    }),
    token: column.text({
      label: "The unique session token",
    }),
    expiresAt: column.date({
      label: "The time when the session expires",
    }),
    ipAddress: column.text({
      optional: true,
      label: "The IP address of the device",
    }),
    userAgent: column.text({
      optional: true,
      label: "The user agent information of the device",
    }),
    impersonatedBy: column.text({
      optional: true,
      label: "The ID of the admin that is impersonating this session.",
    }),
    createdAt: column.date({
      label: "Timestamp of when the session was created",
    }),
    updatedAt: column.date({
      optional: true,
      label: "Timestamp of when the session was updated",
    }),
  },
});
/*
table: account
id	string	PK	Unique identifier for each account
userId	string	FK	The ID of the user
accountId	string	-	The ID of the account as provided by the SSO or equal to userId for credential accounts
providerId	string	-	The ID of the provider
accessToken	string	?	The access token of the account. Returned by the provider
refreshToken	string	?	The refresh token of the account. Returned by the provider
accessTokenExpiresAt	Date	?	The time when the access token expires
refreshTokenExpiresAt	Date	?	The time when the refresh token expires
scope	string	?	The scope of the account. Returned by the provider
idToken	string	?	The ID token returned from the provider
password	string	?	The password of the account. Mainly used for email and password authentication
createdAt	Date	-	Timestamp of when the account was created
updatedAt	Date	-	Timestamp of when the account was updated
*/
const account = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
      label: "Unique identifier for each account",
    }),
    userId: column.text({
      label: "The ID of the user",
      references: () => user.columns.id,
    }),
    accountId: column.text({
      label:
        "The ID of the account as provided by the SSO or equal to userId for credential accounts",
    }),
    providerId: column.text({
      label: "The ID of the provider",
    }),
    accessToken: column.text({
      optional: true,
      label: "The access token of the account. Returned by the provider",
    }),
    refreshToken: column.text({
      optional: true,
      label: "The refresh token of the account. Returned by the provider",
    }),
    accessTokenExpiresAt: column.date({
      optional: true,
      label: "The time when the access token expires",
    }),
    refreshTokenExpiresAt: column.date({
      optional: true,
      label: "The time when the refresh token expires",
    }),
    scope: column.text({
      optional: true,
      label: "The scope of the account. Returned by the provider",
    }),
    idToken: column.text({
      optional: true,
      label: "The ID token returned from the provider",
    }),
    password: column.text({
      optional: true,
      label:
        "The password of the account. Mainly used for email and password authentication",
    }),
    createdAt: column.date({
      label: "Timestamp of when the account was created",
    }),
    updatedAt: column.date({
      optional: true,
      label: "Timestamp of when the account was updated",
    }),
  },
});
/*
table: verification
id	string	PK	Unique identifier for each verification
identifier	string	-	The identifier for the verification request
value	string	-	The value to be verified
expiresAt	Date	-	The time when the verification request expires
createdAt	Date	-	Timestamp of when the verification request was created
updatedAt	Date	-	Timestamp of when the verification request was updated
*/
const verification = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
      label: "Unique identifier for each verification",
    }),
    identifier: column.text({
      label: "The identifier for the verification request",
    }),
    value: column.text({
      label: "The value to be verified",
    }),
    expiresAt: column.date({
      label: "The time when the verification request expires",
    }),
    createdAt: column.date({
      label: "Timestamp of when the verification request was created",
    }),
    updatedAt: column.date({
      optional: true,
      label: "Timestamp of when the verification request was updated",
    }),
  },
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
    user,
    session,
    account,
    verification,
  },
});
