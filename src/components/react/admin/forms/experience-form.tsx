import { IconPlus } from "@tabler/icons-react";
import { formatDateInput } from "@/lib/format";
import type {
  AdminSkillItem,
  PortfolioExperienceItem,
} from "@/types/view-models";
import {
  InputField,
  SelectField,
  TextAreaField,
} from "@/components/react/admin/shared";
import { SkillsList } from "@/components/react/admin/SkillsList";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { NativeSelectOption } from "@/components/ui/native-select";

type ExperienceFormMode =
  | { kind: "add" }
  | {
      kind: "edit";
      item: PortfolioExperienceItem;
      onCancel: () => void;
    };

export function ExperienceForm({
  mode,
  idPrefix,
  skills,
}: {
  mode: ExperienceFormMode;
  idPrefix: string;
  skills: AdminSkillItem[];
}) {
  const isEdit = mode.kind === "edit";
  const item = isEdit ? mode.item : null;
  const fieldId = (name: string) => `${idPrefix}_${name}`;

  return (
    <form method="post" className="grid grid-cols-1 gap-4 md:grid-cols-6">
      <input
        type="hidden"
        name="_action"
        value={isEdit ? "update_experience" : "add_experience"}
      />
      {isEdit ? (
        <input type="hidden" name="id" value={String(item!.id)} />
      ) : null}

      <InputField
        className="md:col-span-6"
        id={fieldId("company")}
        name="name"
        label="Company"
        defaultValue={item?.name ?? undefined}
      />
      <InputField
        className="md:col-span-3"
        id={fieldId("title")}
        name="title"
        label="Job title"
        defaultValue={item?.title ?? undefined}
      />
      <InputField
        className="md:col-span-3"
        id={fieldId("role")}
        name="role"
        label="Role"
        defaultValue={item?.role ?? undefined}
      />
      <TextAreaField
        className="md:col-span-6"
        id={fieldId("description")}
        name="description"
        label="Description"
        defaultValue={item?.description ?? undefined}
        rows={3}
      />
      <InputField
        className="md:col-span-2"
        id={fieldId("url")}
        name="url"
        label="Company URL"
        defaultValue={item?.url ?? undefined}
      />
      <InputField
        className="md:col-span-2"
        id={fieldId("start_date")}
        name="start_date"
        label="Start date"
        type="date"
        defaultValue={item ? formatDateInput(item.startDate) : undefined}
      />
      <InputField
        className="md:col-span-2"
        id={fieldId("end_date")}
        name="end_date"
        label="End date"
        type="date"
        defaultValue={item ? formatDateInput(item.endDate) : undefined}
      />
      <TextAreaField
        className="md:col-span-3"
        id={fieldId("responsibilities")}
        name="responsibilities"
        label="Responsibilities (one per line)"
        defaultValue={item?.responsibilities?.join("\n")}
        rows={4}
      />
      <TextAreaField
        className="md:col-span-3"
        id={fieldId("achievements")}
        name="achievements"
        label="Achievements (one per line)"
        defaultValue={item?.achievements?.join("\n")}
        rows={4}
      />
      <InputField
        className="md:col-span-2"
        id={fieldId("location")}
        name="location"
        label="Location"
        defaultValue={item?.location ?? undefined}
      />
      <SelectField
        className="md:col-span-2"
        id={fieldId("location_type")}
        name="location_type"
        label="Location type"
        defaultValue={item?.locationType ?? "Remote"}
      >
        <NativeSelectOption value="Remote">Remote</NativeSelectOption>
        <NativeSelectOption value="On Site">On Site</NativeSelectOption>
        <NativeSelectOption value="Hybrid">Hybrid</NativeSelectOption>
      </SelectField>
      <Field className="md:col-span-2">
        <FieldLabel htmlFor={fieldId("skills")}>Skills</FieldLabel>
        <SkillsList
          id={fieldId("skills")}
          name="skills"
          items={skills}
          defaultValue={item?.skills ?? undefined}
        />
      </Field>

      <div className="flex items-center gap-3 md:col-span-6">
        <Button type="submit">
          {isEdit ? null : <IconPlus className="size-4" />}
          {isEdit ? "Save" : "Add experience"}
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
