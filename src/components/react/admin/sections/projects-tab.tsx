import type { SectionProps } from "@/components/react/admin/sections/types";
import {
  ActionButtons,
  ErrorBanner,
} from "@/components/react/admin/shared";
import { ProjectsForm } from "@/components/react/admin/forms/projects-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

          <ProjectsForm
            mode={{ kind: "add" }}
            idPrefix="proj_new"
            enableUploads={model.enableUploads}
          />

          <div className="space-y-4">
            {model.projects.map((item) => {
              const editing = editState.projects === item.id;
              return (
                <Card key={item.id}>
                  <CardContent className="space-y-4 pt-6">
                    {editing ? (
                      <ProjectsForm
                        mode={{
                          kind: "edit",
                          item,
                          onCancel: () => onTabChange("projects"),
                        }}
                        idPrefix={`proj_${item.id}`}
                        enableUploads={model.enableUploads}
                      />
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
                            <p className="text-sm text-fg-subtle">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ActionButtons
                          entityId={item.id}
                          deleteAction="delete_project"
                          onEdit={() =>
                            onEditState(
                              "projects",
                              { editProj: item.id },
                              { projects: item.id },
                            )
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
