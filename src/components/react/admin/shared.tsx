import type { ReactNode } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function initials(value?: string | null) {
  if (!value) return "?";
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function monthYear(date: string | null) {
  if (!date) return "";
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "";
  return value.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });
}

export function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <Alert variant="destructive">
      <AlertTitle>Action failed</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export function Field({
  id,
  name,
  label,
  type = "text",
  defaultValue,
  className,
  placeholder,
  required,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | null;
  className?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export function NativeSelect({
  id,
  name,
  label,
  defaultValue,
  className,
  children,
  multiple,
  size,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string | string[];
  className?: string;
  children: ReactNode;
  multiple?: boolean;
  size?: number;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        multiple={multiple}
        size={size}
        className="flex min-h-8 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
      >
        {children}
      </select>
    </div>
  );
}

export function TextAreaField({
  id,
  name,
  label,
  defaultValue,
  rows = 4,
  className,
  placeholder,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string | null;
  rows?: number;
  className?: string;
  placeholder?: string;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  );
}

export function ActionButtons({
  onEdit,
  deleteAction,
  entityId,
  editLabel = "Edit",
}: {
  onEdit: () => void;
  deleteAction: string;
  entityId: number;
  editLabel?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button type="button" variant="outline" onClick={onEdit}>
        <IconEdit className="size-4" />
        {editLabel}
      </Button>
      <form method="post">
        <input type="hidden" name="_action" value={deleteAction} />
        <input type="hidden" name="id" value={String(entityId)} />
        <Button type="submit" variant="destructive">
          <IconTrash className="size-4" />
          Delete
        </Button>
      </form>
    </div>
  );
}
