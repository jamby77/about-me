import { IconPlus } from "@tabler/icons-react";
import { formatDateInput } from "@/lib/format";
import type { AdminEducationItem } from "@/types/view-models";
import { InputField } from "@/components/react/admin/shared";
import { Button } from "@/components/ui/button";

type EducationFormMode =
  | { kind: "add" }
  | {
      kind: "edit";
      item: AdminEducationItem;
      onCancel: () => void;
    };

export function EducationForm({
  mode,
  idPrefix,
}: {
  mode: EducationFormMode;
  idPrefix: string;
}) {
  const isEdit = mode.kind === "edit";
  const item = isEdit ? mode.item : null;
  const fieldId = (name: string) => `${idPrefix}_${name}`;

  return (
    <form method="post" className="grid grid-cols-1 gap-4 md:grid-cols-6">
      <input
        type="hidden"
        name="_action"
        value={isEdit ? "update_education" : "add_education"}
      />
      {isEdit ? (
        <input type="hidden" name="id" value={String(item!.id)} />
      ) : null}

      <InputField
        className="md:col-span-2"
        id={fieldId("name")}
        name="name"
        label="School"
        placeholder="School"
        defaultValue={item?.name}
      />
      <InputField
        id={fieldId("degree")}
        name="degree"
        label="Degree"
        placeholder="Degree"
        defaultValue={item?.degree}
      />
      <InputField
        id={fieldId("field")}
        name="field"
        label="Field of study"
        placeholder="Field of study"
        defaultValue={item?.field}
      />
      <InputField
        id={fieldId("start_date")}
        name="start_date"
        label="Start date"
        type="date"
        defaultValue={item ? formatDateInput(item.startDate) : undefined}
      />
      <InputField
        id={fieldId("end_date")}
        name="end_date"
        label="End date"
        type="date"
        defaultValue={item ? formatDateInput(item.endDate) : undefined}
      />
      <InputField
        className="md:col-span-3"
        id={fieldId("url")}
        name="url"
        label="URL"
        placeholder="URL"
        defaultValue={item?.url}
      />

      <div className="flex items-center gap-3 md:col-span-6">
        <Button type="submit">
          {isEdit ? null : <IconPlus className="size-4" />}
          {isEdit ? "Save" : "Add education"}
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
