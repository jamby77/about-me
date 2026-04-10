import { IconPlus } from "@tabler/icons-react";
import { formatDateInput } from "@/lib/format";
import type { AdminProjectItem } from "@/types/view-models";
import { InputField } from "@/components/react/admin/shared";
import { ImageUploadForm } from "@/components/react/image-upload-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type ProjectsFormMode =
  | { kind: "add" }
  | {
      kind: "edit";
      item: AdminProjectItem;
      onCancel: () => void;
    };

export function ProjectsForm({
  mode,
  idPrefix,
  enableUploads,
  fieldErrors,
}: {
  mode: ProjectsFormMode;
  idPrefix: string;
  enableUploads: boolean;
  fieldErrors?: Record<string, string>;
}) {
  const isEdit = mode.kind === "edit";
  const item = isEdit ? mode.item : null;
  const fieldId = (name: string) => `${idPrefix}_${name}`;

  return (
    <>
      <form method="post" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <input
          type="hidden"
          name="_action"
          value={isEdit ? "update_project" : "add_project"}
        />
        {isEdit ? (
          <input type="hidden" name="id" value={String(item!.id)} />
        ) : null}

        <InputField
          id={fieldId("name")}
          name="name"
          label="Name"
          defaultValue={item?.name}
          error={fieldErrors?.name}
          required
        />
        <InputField
          id={fieldId("description")}
          name="description"
          label="Description"
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
        <InputField
          id={fieldId("repo_url")}
          name="repoUrl"
          label="Repo URL"
          defaultValue={item?.repoUrl}
          error={fieldErrors?.repoUrl}
        />
        <InputField
          id={fieldId("date")}
          name="date"
          label="Date"
          type="date"
          defaultValue={item ? formatDateInput(item.date) : undefined}
          error={fieldErrors?.date}
        />
        {!enableUploads ? (
          <InputField
            id={fieldId("image")}
            name="image"
            label="Image URL"
            defaultValue={item?.image}
            error={fieldErrors?.image}
          />
        ) : null}

        <div className="flex items-center gap-3 md:col-span-3">
          <Button type="submit">
            {isEdit ? null : <IconPlus className="size-4" />}
            {isEdit ? "Save" : "Add project"}
          </Button>
          {isEdit ? (
            <Button type="button" variant="outline" onClick={mode.onCancel}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>

      {isEdit && enableUploads ? (
        <>
          <Separator />
          <ImageUploadForm
            action="upload_project_image"
            inputName="project_image_file"
            inputId={`project_image_file_${item!.id}`}
            hidden={{ project_id: item!.id }}
            title="Upload project image"
          />
        </>
      ) : null}
    </>
  );
}
