import type { SectionProps } from "@/components/react/admin/sections/types";
import {
  ErrorBanner,
  InputField,
  TextAreaField,
} from "@/components/react/admin/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export function PersonalTab({ model }: Pick<SectionProps, "model">) {
  return (
    <TabsContent value="personal">
      <Card>
        <CardHeader>
          <CardTitle>Personal info</CardTitle>
          <CardDescription>Profile copy and public links.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ErrorBanner message={model.errorByTab.personal} />
          <form method="post" className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input type="hidden" name="_action" value="upsert_personal_info" />
            {!model.enableUploads ? (
              <InputField
                id="image"
                name="image"
                label="Image"
                defaultValue={model.personalInfo?.image}
              />
            ) : null}
            <InputField
              id="title"
              name="title"
              label="Title"
              defaultValue={model.personalInfo?.title}
            />
            <InputField
              id="phone"
              name="phone"
              label="Phone"
              type="tel"
              defaultValue={model.personalInfo?.phone}
            />
            <InputField
              id="location"
              name="location"
              label="Location"
              defaultValue={model.personalInfo?.location}
            />
            <InputField
              id="website"
              name="website"
              label="Website"
              type="url"
              defaultValue={model.personalInfo?.website}
            />
            <InputField
              id="linkedin"
              name="linkedin"
              label="LinkedIn"
              type="url"
              defaultValue={model.personalInfo?.linkedin}
            />
            <InputField
              id="github"
              name="github"
              label="GitHub"
              type="url"
              defaultValue={model.personalInfo?.github}
            />
            <InputField
              id="twitter"
              name="twitter"
              label="Twitter"
              type="url"
              defaultValue={model.personalInfo?.twitter}
            />
            <TextAreaField
              id="description"
              name="description"
              label="Description"
              className="md:col-span-3"
              defaultValue={model.personalInfo?.description}
            />
            <div className="md:col-span-3">
              <Button type="submit">Save personal info</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
