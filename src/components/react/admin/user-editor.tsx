import { useEffect, useMemo, useState } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import type { AdminTabId, AdminUserEditorViewModel } from "@/types/view-models";
import {
  BasicTab,
  CertificatesTab,
  EducationTab,
  ExperienceTab,
  ImageTab,
  LanguagesTab,
  PersonalTab,
  ProjectsTab,
  SkillsTab,
} from "@/components/react/admin/editor-sections";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function readEditStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    education: params.get("editEdu")
      ? Number(params.get("editEdu"))
      : undefined,
    experience: params.get("editExp")
      ? Number(params.get("editExp"))
      : undefined,
    certificates: params.get("editCert")
      ? Number(params.get("editCert"))
      : undefined,
    projects: params.get("editProj")
      ? Number(params.get("editProj"))
      : undefined,
  };
}

function updateUrl(
  nextTab: AdminTabId,
  nextEditState: Partial<
    Record<"editEdu" | "editExp" | "editCert" | "editProj", number>
  > = {},
) {
  const url = new URL(window.location.href);
  url.searchParams.set("tab", nextTab);
  url.searchParams.delete("editEdu");
  url.searchParams.delete("editExp");
  url.searchParams.delete("editCert");
  url.searchParams.delete("editProj");

  if (nextEditState.editEdu)
    url.searchParams.set("editEdu", String(nextEditState.editEdu));
  if (nextEditState.editExp)
    url.searchParams.set("editExp", String(nextEditState.editExp));
  if (nextEditState.editCert)
    url.searchParams.set("editCert", String(nextEditState.editCert));
  if (nextEditState.editProj)
    url.searchParams.set("editProj", String(nextEditState.editProj));

  window.history.pushState({}, "", url);
}

export function AdminUserEditor({
  model,
}: {
  model: AdminUserEditorViewModel;
}) {
  const [activeTab, setActiveTab] = useState<AdminTabId>(model.activeTab);
  const [editState, setEditState] = useState(model.editIds);

  useEffect(() => {
    function syncFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const nextTab =
        (params.get("tab") as AdminTabId | null) ?? model.activeTab;
      setActiveTab(nextTab);
      setEditState(readEditStateFromUrl());
    }

    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [model.activeTab]);

  const selectedLanguageIds = useMemo(
    () => new Set(model.userLanguages.map((item) => item.languageId)),
    [model.userLanguages],
  );

  function onTabChange(nextTab: string) {
    const tab = nextTab as AdminTabId;
    setActiveTab(tab);
    setEditState({});
    updateUrl(tab);
  }

  function onEditState(
    tab: AdminTabId,
    patch: Partial<
      Record<"editEdu" | "editExp" | "editCert" | "editProj", number>
    >,
    nextState: AdminUserEditorViewModel["editIds"],
  ) {
    setEditState(nextState);
    updateUrl(tab, patch);
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {model.user.firstName} {model.user.lastName}
          <br />
          <span className="text-base font-normal text-muted-foreground">
            ({model.user.email})
          </span>
        </h1>
        <a href="/admin" className={buttonVariants({ variant: "ghost" })}>
          <IconChevronLeft className="size-4" />
          Back to users
        </a>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList
          variant="line"
          className="mb-8 flex w-full flex-wrap justify-start rounded-none border-b border-bg-subtle p-0"
        >
          {model.tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <BasicTab model={model} />
        <PersonalTab model={model} />
        <ImageTab model={model} />
        <EducationTab
          model={model}
          editState={editState}
          onTabChange={onTabChange}
          onEditState={onEditState}
        />
        <ExperienceTab
          model={model}
          editState={editState}
          onTabChange={onTabChange}
          onEditState={onEditState}
        />
        <CertificatesTab
          model={model}
          editState={editState}
          onTabChange={onTabChange}
          onEditState={onEditState}
        />
        <ProjectsTab
          model={model}
          editState={editState}
          onTabChange={onTabChange}
          onEditState={onEditState}
        />
        <SkillsTab model={model} />
        <LanguagesTab model={model} selectedLanguageIds={selectedLanguageIds} />
      </Tabs>
    </div>
  );
}
