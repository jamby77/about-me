import { IconPlus } from "@tabler/icons-react";
import { formatDateInput } from "@/lib/format";
import type { SectionProps } from "@/components/react/admin/sections/types";
import {
  ActionButtons,
  ErrorBanner,
  Field,
  monthYear,
} from "@/components/react/admin/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export function EducationTab({
  model,
  editState,
  onTabChange,
  onEditState,
}: SectionProps) {
  return (
    <TabsContent value="education">
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ErrorBanner message={model.errorByTab.education} />
          <form method="post" className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <input type="hidden" name="_action" value="add_education" />
            <Field className="md:col-span-2" id="edu_name" name="name" label="School" placeholder="School" />
            <Field id="edu_degree" name="degree" label="Degree" placeholder="Degree" />
            <Field id="edu_field" name="field" label="Field of study" placeholder="Field" />
            <Field id="edu_start_date" name="start_date" label="Start date" type="date" />
            <Field id="edu_end_date" name="end_date" label="End date" type="date" />
            <Field className="md:col-span-3" id="edu_url" name="url" label="URL" placeholder="URL" />
            <div className="md:col-span-6">
              <Button type="submit">
                <IconPlus className="size-4" />
                Add education
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            {model.education.map((item) => {
              const editing = editState.education === item.id;
              return (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    {editing ? (
                      <form method="post" className="grid grid-cols-1 gap-4 md:grid-cols-6">
                        <input type="hidden" name="_action" value="update_education" />
                        <input type="hidden" name="id" value={String(item.id)} />
                        <Field className="md:col-span-2" id={`edu_name_${item.id}`} name="name" label="School" defaultValue={item.name} />
                        <Field id={`edu_degree_${item.id}`} name="degree" label="Degree" defaultValue={item.degree} />
                        <Field id={`edu_field_${item.id}`} name="field" label="Field of study" defaultValue={item.field} />
                        <Field id={`edu_start_${item.id}`} name="start_date" label="Start date" type="date" defaultValue={formatDateInput(item.startDate)} />
                        <Field id={`edu_end_${item.id}`} name="end_date" label="End date" type="date" defaultValue={formatDateInput(item.endDate)} />
                        <Field className="md:col-span-3" id={`edu_url_${item.id}`} name="url" label="URL" defaultValue={item.url} />
                        <div className="flex items-center gap-3 md:col-span-6">
                          <Button type="submit">Save</Button>
                          <Button type="button" variant="outline" onClick={() => onTabChange("education")}>
                            Cancel
                          </Button>
                        </div>
                      </form>
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
                          onEdit={() =>
                            onEditState("education", { editEdu: item.id }, { education: item.id })
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
