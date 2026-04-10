import type { SectionProps } from "@/components/react/admin/sections/types";
import { ImageUploadForm } from "@/components/react/image-upload-form";
import { ErrorBanner } from "@/components/react/admin/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export function ImageTab({ model }: Pick<SectionProps, "model">) {
  if (!model.enableUploads) return null;

  return (
    <TabsContent value="image">
      <Card>
        <CardHeader>
          <CardTitle>CV image</CardTitle>
          <CardDescription>Upload the main portfolio image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ErrorBanner message={model.errorByTab.image?.message} />
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="grow">
              <ImageUploadForm action="upload_user_image" inputName="image_file" />
            </div>
            {model.personalInfo?.image ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <img
                  src={model.personalInfo.image}
                  alt="User"
                  className="w-48 rounded border object-cover"
                />
                <span className="text-sm text-fg-subtle">Current image</span>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
