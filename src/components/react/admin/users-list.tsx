import type { AdminUserSummary } from "@/types/view-models";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { initials } from "@/components/react/admin/shared";

export function AdminUsersList({ users }: { users: AdminUserSummary[] }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-bg-subtle px-6 py-5">
        <h2 className="text-lg font-medium">User Management</h2>
        <p className="mt-1 text-sm text-fg-subtle">Edit users&apos; data</p>
      </div>

      <div className="px-6 py-5">
        {users.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-fg-subtle">No users found.</p>
          </div>
        ) : (
          <ul className="divide-y rounded border">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {initials(user.name || user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-fg-subtle">{user.email}</p>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <a href={`/admin/users/${user.id}`}>Edit</a>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
