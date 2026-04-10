import type { SectionProps } from "@/components/react/admin/sections/types";
import { ErrorBanner, InputField } from "@/components/react/admin/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export function BasicTab({ model }: Pick<SectionProps, "model">) {
  return (
    <TabsContent value="basic">
      <Card>
        <CardHeader>
          <CardTitle>Basic info</CardTitle>
          <CardDescription>Core user account fields.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ErrorBanner message={model.errorByTab.basic} />
          <form method="post" className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input type="hidden" name="_action" value="update_user_basic" />
            <InputField
              id="first_name"
              name="first_name"
              label="First name"
              defaultValue={model.user.firstName}
            />
            <InputField
              id="last_name"
              name="last_name"
              label="Last name"
              defaultValue={model.user.lastName}
            />
            <InputField
              id="email"
              name="email"
              label="Email"
              type="email"
              defaultValue={model.user.email}
            />
            <div className="md:col-span-3">
              <Button type="submit">Save basic</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
