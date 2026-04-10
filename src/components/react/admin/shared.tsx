import type { ReactNode } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { NativeSelect } from "@/components/ui/native-select.tsx";
import { AppAlertDialog } from "@/components/react/app-alert-dialog";

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

function FieldErrorMessage({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="text-xs text-destructive">
      {error}
    </p>
  );
}

function FieldLabelWithRequired({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <FieldLabel htmlFor={htmlFor}>
      {label}
      {required ? (
        <span aria-hidden="true" className="ml-0.5 text-destructive">
          *
        </span>
      ) : null}
    </FieldLabel>
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
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | null;
  className?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <Field className={cn("InputField", className)}>
      <FieldLabelWithRequired htmlFor={id} label={label} required={required} />
      <Input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <FieldErrorMessage id={id} error={error} />
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
  required,
  error,
  ...props
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string | string[];
  className?: string;
  children: ReactNode;
  multiple?: boolean;
  required?: boolean;
  error?: string;
}) {
  return (
    <Field className={cn("SelectField", className)}>
      <FieldLabelWithRequired htmlFor={id} label={label} required={required} />
      <NativeSelect
        id={id}
        name={name}
        defaultValue={defaultValue}
        multiple={multiple}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        {children}
      </NativeSelect>
      <FieldErrorMessage id={id} error={error} />
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
  required,
  error,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string | null;
  rows?: number;
  className?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <Field className={cn("TextAreaField", className)}>
      <FieldLabelWithRequired htmlFor={id} label={label} required={required} />
      <Textarea
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <FieldErrorMessage id={id} error={error} />
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
  const dialogTitle = itemLabel
    ? `Delete "${itemLabel}"?`
    : "Delete this item?";
  const formId = `delete-form-${deleteAction}-${entityId}`;

  return (
    <div className="flex items-center gap-3">
      <Button type="button" variant="outline" onClick={onEdit}>
        <IconEdit className="size-4" />
        {editLabel}
      </Button>

      {/*
        The actual delete form is a sibling of the dialog so the confirm
        button can submit it via the HTML5 `form="…"` attribute (works even
        when the button is portaled out of the form's DOM ancestry).
      */}
      <form id={formId} method="post">
        <input type="hidden" name="_action" value={deleteAction} />
        <input type="hidden" name="id" value={String(entityId)} />
      </form>

      <AppAlertDialog
        trigger={
          <Button type="button" variant="destructive">
            <IconTrash className="size-4" />
            Delete
          </Button>
        }
        title={dialogTitle}
        description="This action cannot be undone."
        actionLabel="Delete"
        actionVariant="destructive"
        submitForm={formId}
      />
    </div>
  );
}
