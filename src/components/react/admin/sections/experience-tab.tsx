import type { SectionProps } from "@/components/react/admin/sections/types";
import {
  ActionButtons,
  ErrorBanner,
} from "@/components/react/admin/shared";
import { ExperienceForm } from "@/components/react/admin/forms/experience-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export function ExperienceTab({
  model,
  editState,
  onTabChange,
  onEditState,
}: SectionProps) {
  return (
    <TabsContent value="experience">
      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ErrorBanner message={model.errorByTab.experience} />

          <ExperienceForm
            mode={{ kind: "add" }}
            idPrefix="exp_new"
            skills={model.skills}
          />

          <div className="space-y-4">
            {model.experience.map((item) => {
              const editing = editState.experience === item.id;
              return (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    {editing ? (
                      <ExperienceForm
                        mode={{
                          kind: "edit",
                          item,
                          onCancel: () => onTabChange("experience"),
                        }}
                        idPrefix={`exp_${item.id}`}
                        skills={model.skills}
                      />
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-medium">
                              {item.name} - {item.title}
                            </p>
                            <p className="text-sm text-fg-subtle">
                              {item.role}
                              {item.location || item.locationType
                                ? ` | ${item.location ?? ""}${item.location && item.locationType ? ", " : ""}${item.locationType ?? ""}`
                                : ""}
                            </p>
                          </div>
                          <ActionButtons
                            entityId={item.id}
                            deleteAction="delete_experience"
                            onEdit={() =>
                              onEditState(
                                "experience",
                                { editExp: item.id },
                                { experience: item.id },
                              )
                            }
                          />
                        </div>
                        {item.skills?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {item.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
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
