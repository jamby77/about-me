"use client";

import * as React from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import type { AdminSkillItem } from "@/types/view-models.ts";
import { cn } from "@/lib/utils.ts";

export function SkillsList({
  id,
  name,
  items,
  defaultValue,
  className,
}: {
  id: string;
  name?: string;
  items: AdminSkillItem[];
  defaultValue?: AdminSkillItem["name"][] | null;
  className?: string;
}) {
  const anchor = useComboboxAnchor();
  return (
    <Combobox
      name={name || id}
      id={id}
      multiple
      autoHighlight
      items={items}
      defaultValue={defaultValue}
    >
      <ComboboxChips ref={anchor} className={cn("w-full", className)}>
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((value: AdminSkillItem["name"]) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder="Select skills" />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: AdminSkillItem) => (
            <ComboboxItem key={`${item.name}-${item.id}`} value={item.name}>
              {item.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
