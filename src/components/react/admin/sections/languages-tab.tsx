import type { SectionProps } from "@/components/react/admin/sections/types";
import { ErrorBanner, SelectField } from "@/components/react/admin/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { IconPlus } from "@tabler/icons-react";
import { NativeSelectOption } from "@/components/ui/native-select.tsx";

export function LanguagesTab({
  model,
  selectedLanguageIds,
}: Pick<SectionProps, "model"> & { selectedLanguageIds: Set<number> }) {
  const tabError = model.errorByTab.languages;
  return (
    <TabsContent value="languages">
      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ErrorBanner message={tabError?.message} />
          <form method="post" className="flex items-end gap-3">
            <input type="hidden" name="_action" value="add_language" />
            <SelectField
              className="flex-1"
              id="language_id"
              name="language_id"
              label="Select language"
              error={tabError?.fieldErrors?.language_id}
              required
            >
              {model.languageOptions.map((language) => (
                <NativeSelectOption key={language.id} value={language.id}>
                  {language.language} ({language.abbr})
                </NativeSelectOption>
              ))}
            </SelectField>
            <Button type="submit">
              <IconPlus className="size-4" />
              Add language
            </Button>
          </form>

          <ul className="flex flex-wrap gap-2">
            {model.userLanguages.map((item) => {
              const language = model.languageOptions.find(
                (entry) => entry.id === item.languageId,
              );
              const label = language
                ? `${language.language} (${language.abbr})`
                : `#${item.languageId}`;

              return (
                <li
                  key={item.id}
                  className="flex items-center gap-2 rounded border px-3 py-1"
                >
                  <span>{label}</span>
                  {selectedLanguageIds.has(item.languageId) ? (
                    <Badge variant="secondary">Added</Badge>
                  ) : null}
                  <form method="post">
                    <input
                      type="hidden"
                      name="_action"
                      value="delete_language"
                    />
                    <input type="hidden" name="id" value={String(item.id)} />
                    <button
                      className="text-red-600"
                      aria-label={`Remove language ${label}`}
                    >
                      x
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
