import type { SectionProps } from "@/components/react/admin/sections/types";
import {
  ActionButtons,
  ErrorBanner,
} from "@/components/react/admin/shared";
import { CertificatesForm } from "@/components/react/admin/forms/certificates-form";
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

          <CertificatesForm mode={{ kind: "add" }} idPrefix="cert_new" />

          <div className="space-y-4">
            {model.certificates.map((item) => {
              const editing = editState.certificates === item.id;
              return (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    {editing ? (
                      <CertificatesForm
                        mode={{
                          kind: "edit",
                          item,
                          onCancel: () => onTabChange("certificates"),
                        }}
                        idPrefix={`cert_${item.id}`}
                      />
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
