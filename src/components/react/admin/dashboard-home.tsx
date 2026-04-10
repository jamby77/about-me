import {
  IconArrowRight,
  IconCheckupList,
  IconSparkles,
  IconStars,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { initials } from "@/components/react/admin/shared";
import type { AdminCurrentUser, AdminUserSummary } from "@/types/view-models";

export function AdminDashboardHome({
  currentUser,
  totalUsers,
  usersWithImages,
  usersWithEmail,
  users,
  recentUsers,
}: {
  currentUser: AdminCurrentUser | null;
  totalUsers: number;
  usersWithImages: number;
  usersWithEmail: number;
  users: AdminUserSummary[];
  recentUsers: AdminUserSummary[];
}) {
  return currentUser ? (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.82fr)]">
        <UsersPanel users={users} />

        <div className="grid gap-4">
          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_22px_80px_rgba(0,0,0,0.28)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Signed In As
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">Session owner</h3>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/6 p-2 text-white/70">
                <IconStars className="size-5" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarImage
                  src={currentUser.image ?? undefined}
                  alt={currentUser.name ?? currentUser.email ?? "Current user"}
                />
                <AvatarFallback>
                  {initials(currentUser.name || currentUser.email)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-white">
                  {currentUser.name || "Admin user"}
                </p>
                <p className="truncate text-sm text-white/55">{currentUser.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-sky-400/12 bg-sky-500/[0.06] p-6 shadow-[0_22px_80px_rgba(0,0,0,0.22)]">
            <div className="mb-3 flex items-center gap-3 text-sky-100">
              <IconCheckupList className="size-5" />
              <h3 className="font-medium">Working pattern</h3>
            </div>
            <p className="text-sm leading-6 text-white/70">
              Use this dashboard as the admin landing page, then jump directly into a specific
              user editor when you need to update profile data.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Total users"
          value={String(totalUsers)}
          detail="Profiles currently available for editing"
          accent="orange"
          icon={<IconUsersGroup className="size-5" />}
        />
        <MetricCard
          label="Profiles with avatars"
          value={String(usersWithImages)}
          detail="Useful signal for visual completeness"
          accent="sky"
          icon={<IconSparkles className="size-5" />}
        />
        <MetricCard
          label="Email coverage"
          value={`${usersWithEmail}/${totalUsers || 0}`}
          detail="Records with contact details already present"
          accent="neutral"
          icon={<IconCheckupList className="size-5" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <RecentPanel recentUsers={recentUsers} />
        <QuickPanel />
      </section>
    </div>
  ) : (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <p className="mb-3 text-sm uppercase tracking-[0.2em] text-white/38">Authentication</p>
      <h2 className="text-3xl font-semibold text-white">Sign in to access the control room</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/58">
        The admin dashboard is available only to authenticated users. Once signed in, you can
        review users, assets, and profile content from a single workspace.
      </p>
      <div className="mt-8">
        <a
          href="/login"
          className={buttonVariants({
            className:
              "h-11 rounded-xl border-orange-400/30 bg-orange-500/85 px-5 text-white shadow-[0_18px_48px_rgba(249,115,22,0.28)] hover:bg-orange-500",
          })}
        >
          Sign in
        </a>
      </div>
    </div>
  );
}

function UsersPanel({ users }: { users: AdminUserSummary[] }) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-[0_28px_120px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-3 border-b border-white/8 px-6 py-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/38">Users</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Manage users
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/58">
            The dashboard now surfaces the full user list directly, so there is no separate list
            page to hop through first.
          </p>
        </div>
      </div>

      <div className="divide-y divide-white/6">
        {users.length ? (
          users.map((user) => (
            <a
              key={user.id}
              href={`/admin/users/${user.id}`}
              className="group flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-white/[0.03]"
            >
              <div className="flex min-w-0 items-center gap-4">
                <Avatar className="size-12">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback>{initials(user.name || user.email)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{user.name}</p>
                  <p className="truncate text-sm text-white/48">
                    {user.email || "No email on file"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden rounded-lg border border-white/8 bg-white/5 px-3 py-1 text-sm text-white/45 sm:inline-flex">
                  #{user.id}
                </span>
                <span
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "pointer-events-none rounded-xl border-white/12 bg-white/6 text-white group-hover:border-white/20 group-hover:bg-white/10",
                  })}
                >
                  Edit
                </span>
              </div>
            </a>
          ))
        ) : (
          <div className="px-6 py-10 text-sm text-white/55">No users found yet.</div>
        )}
      </div>
    </section>
  );
}

function RecentPanel({ recentUsers }: { recentUsers: AdminUserSummary[] }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_120px_rgba(0,0,0,0.28)]">
      <div className="flex flex-col gap-3 border-b border-white/8 px-6 py-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/38">Recent</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Recently touched</h3>
          <p className="mt-2 text-sm text-white/55">
            Fast re-entry points for the latest user records in the system.
          </p>
        </div>
      </div>

      <div className="divide-y divide-white/6">
        {recentUsers.length ? (
          recentUsers.map((user) => (
            <a
              key={user.id}
              href={`/admin/users/${user.id}`}
              className="group flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-white/[0.03]"
            >
              <div className="flex min-w-0 items-center gap-4">
                <Avatar className="size-10">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback>{initials(user.name || user.email)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{user.name}</p>
                  <p className="truncate text-sm text-white/48">
                    {user.email || "No email on file"}
                  </p>
                </div>
              </div>
              <IconArrowRight className="size-4 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white" />
            </a>
          ))
        ) : (
          <div className="px-6 py-10 text-sm text-white/55">No recent users yet.</div>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  accent: "orange" | "sky" | "neutral";
}) {
  const accentClass =
    accent === "orange"
      ? "border-orange-400/12 bg-orange-500/[0.06] text-orange-100"
      : accent === "sky"
        ? "border-sky-400/12 bg-sky-500/[0.06] text-sky-100"
        : "border-white/10 bg-white/[0.035] text-white";

  return (
    <article className={`rounded-[1.35rem] border p-5 shadow-[0_20px_80px_rgba(0,0,0,0.24)] ${accentClass}`}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-white/42">{label}</p>
        <div className="rounded-lg border border-white/10 bg-white/6 p-2">{icon}</div>
      </div>
      <p className="text-4xl font-semibold tracking-tight">{value}</p>
      <p className="mt-3 text-sm leading-6 text-white/58">{detail}</p>
    </article>
  );
}

function QuickPanel() {
  const links = [
    {
      href: "/admin",
      title: "Review profile assets",
      description: "Check avatars, image coverage, and missing profile data.",
    },
    {
      href: "/admin",
      title: "Scan dashboard metrics",
      description: "Use the cards as a fast health check before editing content.",
    },
    {
      href: "/admin",
      title: "Continue maintenance",
      description: "Jump from the dashboard directly into a specific user editor.",
    },
  ];

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.26)]">
      <p className="text-xs uppercase tracking-[0.2em] text-white/38">Quick actions</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Useful entry points</h3>
      <div className="mt-6 space-y-3">
        {links.map((link) => (
          <a
            key={link.title}
            href={link.href}
            className="group block rounded-[1rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/14 hover:bg-white/[0.055]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-white">{link.title}</p>
                <p className="mt-2 text-sm leading-6 text-white/54">{link.description}</p>
              </div>
              <IconArrowRight className="mt-0.5 size-4 shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
