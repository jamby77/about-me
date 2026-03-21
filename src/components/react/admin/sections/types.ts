import type { AdminTabId, AdminUserEditorViewModel } from "@/types/view-models";

export interface SectionProps {
  model: AdminUserEditorViewModel;
  editState: AdminUserEditorViewModel["editIds"];
  onTabChange: (tab: AdminTabId) => void;
  onEditState: (
    tab: AdminTabId,
    patch: Partial<
      Record<"editEdu" | "editExp" | "editCert" | "editProj", number>
    >,
    nextState: AdminUserEditorViewModel["editIds"],
  ) => void;
}
