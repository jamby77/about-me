import { IconPlus } from "@tabler/icons-react";
import { formatDateInput } from "@/lib/format";
import type { AdminCertificateItem } from "@/types/view-models";
import { InputField } from "@/components/react/admin/shared";
import { Button } from "@/components/ui/button";

type CertificatesFormMode =
  | { kind: "add" }
  | {
      kind: "edit";
      item: AdminCertificateItem;
      onCancel: () => void;
    };

export function CertificatesForm({
  mode,
  idPrefix,
  fieldErrors,
}: {
  mode: CertificatesFormMode;
  idPrefix: string;
  fieldErrors?: Record<string, string>;
}) {
  const isEdit = mode.kind === "edit";
  const item = isEdit ? mode.item : null;
  const fieldId = (name: string) => `${idPrefix}_${name}`;

  return (
    <form method="post" className="grid grid-cols-1 gap-4 md:grid-cols-5">
      <input
        type="hidden"
        name="_action"
        value={isEdit ? "update_certificate" : "add_certificate"}
      />
      {isEdit ? (
        <input type="hidden" name="id" value={String(item!.id)} />
      ) : null}

      <InputField
        className="md:col-span-2"
        id={fieldId("name")}
        name="name"
        label="Name"
        defaultValue={item?.name}
        error={fieldErrors?.name}
      />
      <InputField
        id={fieldId("date")}
        name="date"
        label="Date"
        type="date"
        defaultValue={item ? formatDateInput(item.date) : undefined}
        error={fieldErrors?.date}
      />
      <InputField
        id={fieldId("description")}
        name="description"
        label="Issuer / Description"
        defaultValue={item?.description}
        error={fieldErrors?.description}
      />
      <InputField
        id={fieldId("url")}
        name="url"
        label="URL"
        defaultValue={item?.url}
        error={fieldErrors?.url}
      />

      <div className="flex items-center gap-3 md:col-span-5">
        <Button type="submit">
          {isEdit ? null : <IconPlus className="size-4" />}
          {isEdit ? "Save" : "Add certificate"}
        </Button>
        {isEdit ? (
          <Button type="button" variant="outline" onClick={mode.onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
