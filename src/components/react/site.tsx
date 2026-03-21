import { useState, type ComponentType, type ReactNode } from "react"
import {
  IconBrandCss3,
  IconBrandFigma,
  IconBrandFlutter,
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandHtml5,
  IconBrandJavascript,
  IconBrandKotlin,
  IconBrandLinkedin,
  IconBrandMysql,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandReact,
  IconBrandTailwind,
  IconBrandTypescript,
  IconBrandX,
  IconBrandGit,
  IconCertificate,
  IconExternalLink,
  IconFolder,
  IconMapPin,
  IconMail,
  IconPhone,
  IconSchool,
  IconWorld,
  IconCode,
} from "@tabler/icons-react"
import type { PortfolioSkillItem, PortfolioViewModel } from "@/types/view-models"
import { cn } from "@/lib/utils"

function Section({
  title,
  className,
  children,
}: {
  title?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section className={cn("flex flex-col gap-4 print:gap-0", className)}>
      {title ? (
        <h3 className="relative flex w-full items-center gap-3 pb-4 text-3xl print:gap-1 print:pb-0 print:text-xl">
          {title}
        </h3>
      ) : null}
      {children}
    </section>
  )
}

function SocialLink({
  href,
  title,
  Icon,
}: {
  href: string
  title: string
  Icon: ComponentType<{ className?: string }>
}) {
  return (
    <a
      className="inline-flex size-8 items-center justify-center rounded-md p-1 text-hue transition-all duration-500 ease-linear hover:bg-bg-button-accent hover:text-fg-inverted"
      href={href}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon className="size-5" />
    </a>
  )
}

const skillIcons: Record<string, ComponentType<{ className?: string }>> = {
  HTML: IconBrandHtml5,
  CSS: IconBrandCss3,
  JavaScript: IconBrandJavascript,
  TypeScript: IconBrandTypescript,
  React: IconBrandReact,
  Node: IconBrandNodejs,
  MySQL: IconBrandMysql,
  Git: IconBrandGit,
  GitHub: IconBrandGithub,
  Tailwind: IconBrandTailwind,
  "Next.js": IconBrandNextjs,
  Swift: IconCode,
  SwiftUI: IconCode,
  Kotlin: IconBrandKotlin,
  Flutter: IconBrandFlutter,
  Figma: IconBrandFigma,
  Gitlab: IconBrandGitlab,
}

function SkillPill({ skill }: { skill: PortfolioSkillItem | { name: string } }) {
  const Icon = skillIcons[skill.name]

  return (
    <li className="flex items-center gap-1 rounded-md border border-hue/20 border-solid bg-bg-button-accent/20 px-2 py-0.5 text-xs text-fg-muted print:border-none print:bg-transparent print:p-0 print:text-zinc-800">
      {Icon ? <Icon className="size-4 text-hue" /> : null}
      <span>{skill.name}</span>
    </li>
  )
}

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
                {item.url ? <IconExternalLink className="ml-1 inline-block size-4 text-hue print:hidden" /> : null}
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

export function PortfolioPage({ cv }: { cv: PortfolioViewModel }) {
  const { basics } = cv
  const printInfo = [basics.email, basics.phone, basics.linkedin].filter(Boolean).join(" • ")
  const showPersonal = import.meta.env.SHOW_PERSONAL

  return (
    <main className="relative grid max-w-7xl gap-12 p-8 max-sm:py-16 md:grid-cols-6 md:p-16 xl:gap-24 print:max-w-none print:grid-cols-1 print:gap-6">
      <div className="space-y-6 md:col-span-2 print:col-span-1 print:grid print:grid-cols-2 print:gap-5 print:space-y-0">
        <Section>
          <div className="flex flex-col-reverse gap-8">
            <div className="flex flex-col gap-1 pr-8 print:gap-0 print:pr-0">
              <h1 className="text-4xl font-bold print:text-3xl">{basics.name}</h1>
              <h2 className="text-balance text-base text-fg-muted print:text-lg">{basics.title}</h2>
              <div className="flex items-center gap-2 pt-2 text-sm text-fg-muted">
                <IconMapPin className="size-4" />
                {basics.location}
              </div>
              <footer className="print mt-2 flex gap-1 text-sm">{printInfo}</footer>
              <footer className="no-print mt-2 flex gap-1 text-sm">
                {showPersonal && basics.email ? (
                  <SocialLink
                    href={`mailto:${basics.email}`}
                    title={`Send email to ${basics.name} at ${basics.email}`}
                    Icon={IconMail}
                  />
                ) : null}
                {showPersonal && basics.phone ? (
                  <SocialLink
                    href={`tel:${basics.phone}`}
                    title={`Call ${basics.name} at ${basics.phone}`}
                    Icon={IconPhone}
                  />
                ) : null}
                {basics.linkedin ? (
                  <SocialLink
                    href={basics.linkedin}
                    title={`Visit ${basics.name} profile on LinkedIn`}
                    Icon={IconBrandLinkedin}
                  />
                ) : null}
                {basics.twitter ? (
                  <SocialLink href={basics.twitter} title={`Visit ${basics.name} profile on X`} Icon={IconBrandX} />
                ) : null}
                {basics.github ? (
                  <SocialLink
                    href={basics.github}
                    title={`Visit ${basics.name} profile on GitHub`}
                    Icon={IconBrandGithub}
                  />
                ) : null}
                {basics.website ? (
                  <SocialLink href={basics.website} title={`Visit ${basics.name} website`} Icon={IconWorld} />
                ) : null}
              </footer>
            </div>
            <figure className="relative w-fit print:hidden">
              <img
                className="aspect-square w-32 rounded-2xl bg-cover object-cover shadow-lg shadow-hue"
                src={basics.image}
                alt={basics.name}
                width={128}
                height={128}
              />
              <div className="pointer-events-none absolute -inset-2">
                <div className="absolute -inset-y-8 right-0 w-px bg-hue/50 mask-[linear-gradient(to_top,transparent,white_4rem,white_calc(100%-4rem),transparent)]" />
                <div className="absolute -inset-y-8 left-0 w-px bg-hue/50 mask-[linear-gradient(to_top,transparent,white_4rem,white_calc(100%-4rem),transparent)]" />
                <div className="absolute -inset-x-8 bottom-0 h-px bg-hue/50 mask-[linear-gradient(to_left,transparent,white_4rem,white_calc(100%-4rem),transparent)]" />
                <div className="absolute -inset-x-8 top-0 h-px bg-hue/50 mask-[linear-gradient(to_left,transparent,white_4rem,white_calc(100%-4rem),transparent)]" />
              </div>
            </figure>
          </div>
        </Section>

        <Section title="About">
          <p className="text-start! text-xl! indent-8 text-balance">{basics.description}</p>
        </Section>
      </div>

      <div className="space-y-12 md:col-span-4 print:col-span-1 print:grid print:grid-cols-4 print:gap-2 print:space-y-0">
        <Section className="print:col-span-3" title="Experience">
          <ul className="flex flex-col">
            {cv.work.map((item) => (
              <ExperienceItem key={item.id} item={item} />
            ))}
          </ul>
        </Section>

        {cv.projects.length ? (
          <Section className="print:hidden" title="Projects">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 print:flex print:flex-col">
              {cv.projects.map((project) => (
                <div
                  key={project.id}
                  role="contentinfo"
                  className="relative flex flex-col rounded-md bg-bg-button-muted/50 p-5 shadow-sm ring-1 ring-muted"
                >
                  <div className="flex items-center justify-between space-x-[10px]">
                    <div className="flex items-center gap-2">
                      <IconFolder className="size-5 text-hue" />
                      <div className="flex items-center gap-[6px]">
                        {project.url ? (
                          <a
                            className="group flex items-center gap-[6px] text-lg decoration-dotted underline-offset-[5px] hover:text-hue hover:underline"
                            href={project.url}
                            title={`View ${project.name}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {project.name}
                            <span className="text-hue transition ease-linear group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                              <IconExternalLink className="size-4" />
                            </span>
                          </a>
                        ) : (
                          <span>{project.name}</span>
                        )}
                      </div>
                    </div>

                    {project.repoUrl ? (
                      <a
                        href={project.repoUrl}
                        title="View repository"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-75 transition-opacity duration-100 hover:opacity-100"
                      >
                        <IconBrandGithub className="size-5" />
                      </a>
                    ) : null}
                  </div>

                  <p className="py-3 text-sm text-fg-base">{project.description}</p>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        <Section className="print:hidden" title="Skills">
          <ul className="inline-flex flex-wrap gap-6 [&>li]:text-sm">
            {cv.skills.map((skill) => (
              <SkillPill key={skill.id} skill={skill} />
            ))}
          </ul>
        </Section>

        <Section className="order-first" title="Education">
          <ul className="space-y-4 py-3 print:space-y-0">
            {cv.education.map((item) => {
              const startDate = new Date(item.startDate)
              const endDate = item.endDate ? new Date(item.endDate) : null

              return (
                <div key={item.id} className="flex items-baseline">
                  <IconSchool className="mr-2 size-5 text-hue" />
                  <div className="relative w-full items-baseline justify-between gap-2">
                    <h3 className="mr-6 items-baseline gap-x-2 gap-y-0.5 font-medium">
                      <a
                        target="_blank"
                        className="group flex items-center gap-[6px] decoration-dotted underline-offset-[5px] hover:text-hue hover:underline"
                        href={item.url ?? "#"}
                        rel="noreferrer"
                      >
                        {item.name}
                      </a>
                    </h3>
                    <div className="text-sm text-fg-muted">{item.field}</div>
                    <time className="right-0 top-0 text-xs text-fg-muted md:absolute md:block">
                      {startDate.getFullYear()} - {endDate ? endDate.getFullYear() : "Actual"}
                    </time>
                  </div>
                </div>
              )
            })}
          </ul>

          {cv.certificates.length ? (
            <>
              <h4>Certificates</h4>
              <ul className="space-y-4 py-3 print:space-y-0">
                {cv.certificates.map((item) => {
                  const year = item.date ? new Date(item.date).getFullYear() : "N/A"

                  return (
                    <div key={item.id} className="flex items-baseline">
                      <IconCertificate className="mr-2 size-5 text-hue" />
                      <div className="relative w-full items-baseline justify-between gap-2">
                        <h3 className="mr-6 items-baseline gap-x-2 gap-y-0.5 font-medium">
                          <a
                            className="group flex items-center gap-[6px] text-fg-base decoration-dotted underline-offset-[5px] hover:text-hue hover:underline"
                            href={item.url ?? "#"}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {item.name}
                          </a>
                        </h3>
                        <div className="text-sm text-fg-muted">{item.description}</div>
                        <time className="right-0 top-0 text-xs text-fg-muted md:absolute md:block">{year}</time>
                      </div>
                    </div>
                  )
                })}
              </ul>
            </>
          ) : null}
        </Section>
      </div>

      <div className="flex w-full max-w-7xl justify-center md:col-span-6 print:hidden" />
    </main>
  )
}
