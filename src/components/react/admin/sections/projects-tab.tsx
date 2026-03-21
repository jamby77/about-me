import { IconPlus } from "@tabler/icons-react";
import { formatDateInput } from "@/lib/format";
import type { SectionProps } from "@/components/react/admin/sections/types";
import { ImageUploadForm } from "@/components/react/image-upload-form";
import { ActionButtons, ErrorBanner, Field } from "@/components/react/admin/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";

export function ProjectsTab({
  model,
  editState,
  onTabChange,
  onEditState,
}: SectionProps) {
  return (
    <TabsContent value="projects">
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ErrorBanner message={model.errorByTab.projects} />
          <form method="post" className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input type="hidden" name="_action" value="add_project" />
            <Field id="proj_name" name="name" label="Name" />
            <Field id="proj_description" name="description" label="Description" />
            <Field id="proj_url" name="url" label="URL" />
            <Field id="proj_repo_url" name="repoUrl" label="Repo URL" />
            <Field id="proj_date" name="date" label="Date" type="date" />
            {!model.enableUploads ? <Field id="proj_image" name="image" label="Image URL" /> : null}
            <div className="md:col-span-3">
              <Button type="submit">
                <IconPlus className="size-4" />
                Add project
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            {model.projects.map((item) => {
              const editing = editState.projects === item.id;
              return (
                <Card key={item.id}>
                  <CardContent className="space-y-4 pt-6">
                    {editing ? (
                      <>
                        <form method="post" className="grid grid-cols-1 gap-4 md:grid-cols-6">
                          <input type="hidden" name="_action" value="update_project" />
                          <input type="hidden" name="id" value={String(item.id)} />
                          <Field id={`proj_name_${item.id}`} name="name" label="Name" defaultValue={item.name} />
                          <Field id={`proj_desc_${item.id}`} name="description" label="Description" defaultValue={item.description} />
                          <Field id={`proj_url_${item.id}`} name="url" label="URL" defaultValue={item.url} />
                          <Field id={`proj_repo_${item.id}`} name="repoUrl" label="Repo URL" defaultValue={item.repoUrl} />
                          <Field id={`proj_date_${item.id}`} name="date" label="Date" type="date" defaultValue={formatDateInput(item.date)} />
                          {!model.enableUploads ? (
                            <Field id={`proj_image_${item.id}`} name="image" label="Image URL" defaultValue={item.image} />
                          ) : null}
                          <div className="flex items-center gap-3 md:col-span-6">
                            <Button type="submit">Save</Button>
                            <Button type="button" variant="outline" onClick={() => onTabChange("projects")}>
                              Cancel
                            </Button>
                          </div>
                        </form>

                        {model.enableUploads ? (
                          <>
                            <Separator />
                            <ImageUploadForm
                              action="upload_project_image"
                              inputName="project_image_file"
                              inputId={`project_image_file_${item.id}`}
                              hidden={{ project_id: item.id }}
                              title="Upload project image"
                            />
                          </>
                        ) : null}
                      </>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt="Project"
                              className="h-12 w-12 rounded border object-cover"
                            />
                          ) : null}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-fg-subtle">{item.description}</p>
                          </div>
                        </div>
                        <ActionButtons
                          entityId={item.id}
                          deleteAction="delete_project"
                          onEdit={() =>
                            onEditState("projects", { editProj: item.id }, { projects: item.id })
                          }
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
