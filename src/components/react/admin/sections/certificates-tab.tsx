import { IconPlus } from "@tabler/icons-react";
import { formatDateInput } from "@/lib/format";
import type { SectionProps } from "@/components/react/admin/sections/types";
import {
  ActionButtons,
  ErrorBanner,
  InputField,
} from "@/components/react/admin/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export function CertificatesTab({
  model,
  editState,
  onTabChange,
  onEditState,
}: SectionProps) {
  return (
    <TabsContent value="certificates">
      <Card>
        <CardHeader>
          <CardTitle>Certificates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ErrorBanner message={model.errorByTab.certificates} />
          <form method="post" className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <input type="hidden" name="_action" value="add_certificate" />
            <InputField
              className="md:col-span-2"
              id="cert_name"
              name="name"
              label="Name"
            />
            <InputField id="cert_date" name="date" label="Date" type="date" />
            <InputField
              id="cert_description"
              name="description"
              label="Issuer / Description"
            />
            <InputField id="cert_url" name="url" label="URL" />
            <div className="md:col-span-5">
              <Button type="submit">
                <IconPlus className="size-4" />
                Add certificate
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            {model.certificates.map((item) => {
              const editing = editState.certificates === item.id;
              return (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    {editing ? (
                      <form
                        method="post"
                        className="grid grid-cols-1 gap-4 md:grid-cols-5"
                      >
                        <input
                          type="hidden"
                          name="_action"
                          value="update_certificate"
                        />
                        <input
                          type="hidden"
                          name="id"
                          value={String(item.id)}
                        />
                        <InputField
                          className="md:col-span-2"
                          id={`cert_name_${item.id}`}
                          name="name"
                          label="Name"
                          defaultValue={item.name}
                        />
                        <InputField
                          id={`cert_date_${item.id}`}
                          name="date"
                          label="Date"
                          type="date"
                          defaultValue={formatDateInput(item.date)}
                        />
                        <InputField
                          id={`cert_description_${item.id}`}
                          name="description"
                          label="Issuer / Description"
                          defaultValue={item.description}
                        />
                        <InputField
                          id={`cert_url_${item.id}`}
                          name="url"
                          label="URL"
                          defaultValue={item.url}
                        />
                        <div className="flex items-center gap-3 md:col-span-5">
                          <Button type="submit">Save</Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => onTabChange("certificates")}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-fg-subtle">
                            {item.description}
                          </p>
                        </div>
                        <ActionButtons
                          entityId={item.id}
                          deleteAction="delete_certificate"
                          onEdit={() =>
                            onEditState(
                              "certificates",
                              { editCert: item.id },
                              { certificates: item.id },
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
