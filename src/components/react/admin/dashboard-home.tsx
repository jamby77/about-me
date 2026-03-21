import type { AdminCurrentUser } from "@/types/view-models";

export function AdminDashboardHome({
  currentUser,
}: {
  currentUser: AdminCurrentUser | null;
}) {
  return currentUser ? (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <a
          href="/admin/users"
          className="text-2xl text-fg-link hover:underline"
        >
          Manage Users
        </a>
      </div>
    </div>
  ) : (
    <div className="text-center">
      <a href="/login" className="text-fg-link hover:underline">
        Sign in
      </a>
    </div>
  );
}
