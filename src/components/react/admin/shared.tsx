import type { ReactNode } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { NativeSelect } from "@/components/ui/native-select.tsx";

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

export function InputField({
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
    <Field className={cn("InputField", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
      />
    </Field>
  );
}

export function SelectField({
  id,
  name,
  label,
  defaultValue,
  className,
  children,
  multiple,
  ...props
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string | string[];
  className?: string;
  children: ReactNode;
  multiple?: boolean;
}) {
  return (
    <Field className={cn("SelectField", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <NativeSelect
        id={id}
        name={name}
        defaultValue={defaultValue}
        multiple={multiple}
        {...props}
      >
        {children}
      </NativeSelect>
    </Field>
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
    <Field className={cn("TextAreaField", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        placeholder={placeholder}
      />
    </Field>
  );
}

export function ActionButtons({
  onEdit,
  deleteAction,
  entityId,
  editLabel = "Edit",
  itemLabel,
}: {
  onEdit: () => void;
  deleteAction: string;
  entityId: number;
  editLabel?: string;
  itemLabel?: string | null;
}) {
  const confirmMessage = itemLabel
    ? `Delete "${itemLabel}"? This cannot be undone.`
    : "Delete this item? This cannot be undone.";

  return (
    <div className="flex items-center gap-3">
      <Button type="button" variant="outline" onClick={onEdit}>
        <IconEdit className="size-4" />
        {editLabel}
      </Button>
      <form
        method="post"
        onSubmit={(event) => {
          if (!window.confirm(confirmMessage)) {
            event.preventDefault();
          }
        }}
      >
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
