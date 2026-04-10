"use client"

import { useState } from "react"
import { IconExternalLink } from "@tabler/icons-react"
import type { PortfolioViewModel } from "@/types/view-models"
import { SkillPill } from "@/components/react/site"
import { cn } from "@/lib/utils"

function ExperienceItem({
  item,
}: {
  item: PortfolioViewModel["work"][number]
}) {
  const [expanded, setExpanded] = useState(false)
  const startDate = new Date(item.startDate)
  const endDate = item.endDate ? new Date(item.endDate) : null
  const hasMore = Boolean(item.responsibilities?.length || item.achievements?.length)

  return (
    <li className="relative print:py-2">
      <div className="group relative grid pb-1 transition-all print:grid-cols-1 print:gap-1 print:pb-0 sm:grid-cols-12 sm:gap-8 md:gap-6 lg:hover:!opacity-100">
        <header className="relative mt-1 text-xs font-semibold sm:col-span-2">
          <time dateTime={startDate.toISOString()}>{startDate.getFullYear()}</time> -{" "}
          <time dateTime={endDate?.toISOString() ?? ""}>
            {endDate ? endDate.getFullYear() : "Present"}
          </time>
        </header>
        <div className="relative flex flex-col pb-6 before:absolute before:-ml-6 before:mt-2 before:h-full before:w-px before:bg-muted print:before:hidden print:pb-0 sm:col-span-10">
          <div className="absolute mt-2 h-2 w-2 -translate-x-[1.71rem] rounded-full bg-muted ring ring-ring-fill print:hidden" />
          <h3>
            <span className="inline-flex items-center text-lg leading-tight print:text-base">
              <span>
                {item.role || item.title || "Role"} <span>@</span>{" "}
                {item.url ? (
                  <a className="text-hue" href={item.url} target="_blank" rel="noreferrer">
                    {item.name}
                  </a>
                ) : (
                  <span>{item.name}</span>
                )}
                {item.url ? (
                  <IconExternalLink
                    className="ml-1 inline-block size-4 text-hue print:hidden"
                    aria-hidden
                  />
                ) : null}
              </span>
            </span>
          </h3>
          {item.location || item.locationType ? (
            <div className="text-xs text-fg-muted">
              {item.location}
              {item.location && item.locationType ? " - " : null}
              {item.locationType}
            </div>
          ) : null}

          <div className="mt-4 flex flex-col gap-4 text-sm print:gap-0 print:text-xs">
            {item.description ? (
              <div className="flex flex-col gap-1">
                <h4>Summary:</h4>
                <ul className="flex list-disc flex-col gap-2 text-fg-muted [&>li]:ml-4">
                  <li>{item.description}</li>
                </ul>
              </div>
            ) : null}

            {hasMore ? (
              <div
                className={cn(
                  "relative flex flex-col gap-4 print:gap-2",
                  !expanded ? "max-sm:!h-auto md:max-h-52 md:overflow-hidden" : "",
                )}
              >
                {!expanded ? (
                  <div className="absolute inset-x-0 bottom-0 hidden h-12 bg-gradient-to-t from-grad-hue to-grad-hue/0 print:hidden md:block" />
                ) : null}
                {item.responsibilities?.length ? (
                  <div className="flex flex-col gap-1">
                    <h4>Responsibilities:</h4>
                    <ul className="flex list-disc flex-col gap-2 text-fg-muted [&>li]:ml-4">
                      {item.responsibilities.map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {item.achievements?.length ? (
                  <div className="flex flex-col gap-1">
                    <h4>Achievements:</h4>
                    <ul className="flex list-disc flex-col gap-2 text-fg-muted [&>li]:ml-4">
                      {item.achievements.map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            {hasMore ? (
              <button
                type="button"
                className="group/more hidden items-center text-sm font-medium text-hue transition-colors print:hidden md:flex"
                onClick={() => setExpanded((current) => !current)}
              >
                <span>{expanded ? "Show less" : "Show more"}</span>
                <IconExternalLink
                  className={cn(
                    "ml-1 size-4 rotate-45 transition-transform duration-200 ease-out",
                    expanded ? "rotate-[225deg]" : "",
                  )}
                  aria-hidden
                />
              </button>
            ) : null}

            {item.skills?.length ? (
              <ul className="flex flex-wrap gap-2 print:hidden" aria-label="Technologies used">
                {item.skills.map((skill) => (
                  <SkillPill key={skill} skill={{ name: skill }} />
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  )
}

export function PortfolioExperienceSection({
  work,
  className,
}: {
  work: PortfolioViewModel["work"]
  className?: string
}) {
  return (
    <section className={cn("flex flex-col gap-4 print:gap-0", className)}>
      <h3 className="relative flex w-full items-center gap-3 pb-4 text-3xl print:gap-1 print:pb-0 print:text-xl">
        Experience
      </h3>
      <ul className="flex flex-col">
        {work.map((item) => (
          <ExperienceItem key={item.id} item={item} />
        ))}
      </ul>
    </section>
  )
}
