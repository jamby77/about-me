import { IconPlus } from "@tabler/icons-react";
import { formatDateInput } from "@/lib/format";
import type { SectionProps } from "@/components/react/admin/sections/types";
import {
  ActionButtons,
  ErrorBanner,
  Field,
  NativeSelect,
  TextAreaField,
} from "@/components/react/admin/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
          <form method="post" className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <input type="hidden" name="_action" value="add_experience" />
            <Field className="md:col-span-6" id="exp_company" name="name" label="Company" />
            <Field className="md:col-span-3" id="exp_title" name="title" label="Job title" />
            <Field className="md:col-span-3" id="exp_role" name="role" label="Role" />
            <TextAreaField className="md:col-span-6" id="exp_description" name="description" label="Description" rows={3} />
            <Field className="md:col-span-2" id="exp_url" name="url" label="Company URL" />
            <Field className="md:col-span-2" id="exp_start_date" name="start_date" label="Start date" type="date" />
            <Field className="md:col-span-2" id="exp_end_date" name="end_date" label="End date" type="date" />
            <TextAreaField className="md:col-span-3" id="exp_responsibilities" name="responsibilities" label="Responsibilities (one per line)" rows={4} />
            <TextAreaField className="md:col-span-3" id="exp_achievements" name="achievements" label="Achievements (one per line)" rows={4} />
            <Field className="md:col-span-2" id="exp_location" name="location" label="Location" />
            <NativeSelect className="md:col-span-2" id="exp_location_type" name="location_type" label="Location type" defaultValue="Remote">
              <option value="Remote">Remote</option>
              <option value="On Site">On Site</option>
              <option value="Hybrid">Hybrid</option>
            </NativeSelect>
            <NativeSelect className="md:col-span-2" id="exp_skills" name="skills" label="Skills (hold Cmd/Ctrl to select multiple)" multiple size={4}>
              {model.skills.map((skill) => (
                <option key={skill.id} value={skill.name}>
                  {skill.name}
                </option>
              ))}
            </NativeSelect>
            <div className="md:col-span-6">
              <Button type="submit">
                <IconPlus className="size-4" />
                Add experience
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            {model.experience.map((item) => {
              const editing = editState.experience === item.id;
              return (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    {editing ? (
                      <form method="post" className="grid grid-cols-1 gap-4 md:grid-cols-6">
                        <input type="hidden" name="_action" value="update_experience" />
                        <input type="hidden" name="id" value={String(item.id)} />
                        <Field className="md:col-span-6" id={`exp_name_${item.id}`} name="name" label="Company" defaultValue={item.name} />
                        <Field className="md:col-span-3" id={`exp_title_${item.id}`} name="title" label="Job title" defaultValue={item.title} />
                        <Field className="md:col-span-3" id={`exp_role_${item.id}`} name="role" label="Role" defaultValue={item.role} />
                        <TextAreaField className="md:col-span-6" id={`exp_description_${item.id}`} name="description" label="Description" defaultValue={item.description} rows={3} />
                        <Field className="md:col-span-2" id={`exp_url_${item.id}`} name="url" label="Company URL" defaultValue={item.url} />
                        <Field className="md:col-span-2" id={`exp_start_${item.id}`} name="start_date" label="Start date" type="date" defaultValue={formatDateInput(item.startDate)} />
                        <Field className="md:col-span-2" id={`exp_end_${item.id}`} name="end_date" label="End date" type="date" defaultValue={formatDateInput(item.endDate)} />
                        <TextAreaField className="md:col-span-3" id={`exp_resp_${item.id}`} name="responsibilities" label="Responsibilities (one per line)" defaultValue={item.responsibilities?.join("\n")} rows={4} />
                        <TextAreaField className="md:col-span-3" id={`exp_ach_${item.id}`} name="achievements" label="Achievements (one per line)" defaultValue={item.achievements?.join("\n")} rows={4} />
                        <Field className="md:col-span-2" id={`exp_loc_${item.id}`} name="location" label="Location" defaultValue={item.location} />
                        <NativeSelect className="md:col-span-2" id={`exp_loc_type_${item.id}`} name="location_type" label="Location type" defaultValue={item.locationType ?? "Remote"}>
                          <option value="Remote">Remote</option>
                          <option value="On Site">On Site</option>
                          <option value="Hybrid">Hybrid</option>
                        </NativeSelect>
                        <NativeSelect className="md:col-span-2" id={`exp_skills_${item.id}`} name="skills" label="Skills" multiple size={4} defaultValue={item.skills ?? undefined}>
                          {model.skills.map((skill) => (
                            <option key={skill.id} value={skill.name}>
                              {skill.name}
                            </option>
                          ))}
                        </NativeSelect>
                        <div className="flex items-center gap-3 md:col-span-6">
                          <Button type="submit">Save</Button>
                          <Button type="button" variant="outline" onClick={() => onTabChange("experience")}>
                            Cancel
                          </Button>
                        </div>
                      </form>
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
                              onEditState("experience", { editExp: item.id }, { experience: item.id })
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
