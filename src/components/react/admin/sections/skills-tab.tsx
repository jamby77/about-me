import { IconPlus } from "@tabler/icons-react";
import type { SectionProps } from "@/components/react/admin/sections/types";
import { ErrorBanner, InputField } from "@/components/react/admin/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export function SkillsTab({ model }: Pick<SectionProps, "model">) {
  return (
    <TabsContent value="skills">
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ErrorBanner message={model.errorByTab.skills} />
          <form method="post" className="flex items-end gap-3">
            <input type="hidden" name="_action" value="add_skill" />
            <InputField
              className="flex-1"
              id="skill_name"
              name="name"
              label="Skill name"
              placeholder="e.g. React"
            />
            <Button type="submit">
              <IconPlus className="size-4" />
              Add skill
            </Button>
          </form>

          <ul className="flex flex-wrap gap-2">
            {model.skills.map((skill) => (
              <li
                key={skill.id}
                className="flex items-center gap-2 rounded border px-3 py-1"
              >
                <span>{skill.name}</span>
                <form method="post">
                  <input type="hidden" name="_action" value="delete_skill" />
                  <input type="hidden" name="id" value={String(skill.id)} />
                  <button
                    className="text-red-600"
                    aria-label={`Delete skill ${skill.name}`}
                  >
                    x
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
