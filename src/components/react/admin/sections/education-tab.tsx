import type { SectionProps } from "@/components/react/admin/sections/types";
import {
  ActionButtons,
  ErrorBanner,
  monthYear,
} from "@/components/react/admin/shared";
import { EducationForm } from "@/components/react/admin/forms/education-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export function EducationTab({
  model,
  editState,
  onTabChange,
  onEditState,
}: SectionProps) {
  const tabError = model.errorByTab.education;
  return (
    <TabsContent value="education">
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ErrorBanner message={tabError?.message} />

          <EducationForm
            mode={{ kind: "add" }}
            idPrefix="edu_new"
            fieldErrors={tabError?.fieldErrors}
          />

          <div className="space-y-4">
            {model.education.map((item) => {
              const editing = editState.education === item.id;
              return (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    {editing ? (
                      <EducationForm
                        mode={{
                          kind: "edit",
                          item,
                          onCancel: () => onTabChange("education"),
                        }}
                        idPrefix={`edu_${item.id}`}
                        fieldErrors={tabError?.fieldErrors}
                      />
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">
                            {item.name} - {item.degree}
                          </p>
                          <p className="text-sm text-fg-subtle">{item.field}</p>
                          <p className="text-sm text-fg-subtle">
                            {monthYear(item.startDate)}
                            {item.endDate ? ` - ${monthYear(item.endDate)}` : ""}
                          </p>
                        </div>
                        <ActionButtons
                          entityId={item.id}
                          deleteAction="delete_education"
                          itemLabel={item.name}
                          onEdit={() =>
                            onEditState(
                              "education",
                              { editEdu: item.id },
                              { education: item.id },
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
