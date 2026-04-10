import type { ComponentType, ReactNode } from "react"
import {
  IconBrandCss3,
  IconBrandFigma,
  IconBrandFlutter,
  IconBrandGithub,
  IconBrandGit,
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
import type { PortfolioBasics, PortfolioCertificateItem, PortfolioEducationItem, PortfolioSkillItem, PortfolioViewModel } from "@/types/view-models"
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
  Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}) {
  return (
    <a
      className="inline-flex size-8 items-center justify-center rounded-md p-1 text-hue transition-all duration-500 ease-linear hover:bg-bg-button-accent hover:text-fg-inverted"
      href={href}
      title={title}
      aria-label={title}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon className="size-5" aria-hidden />
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

export function SkillPill({ skill }: { skill: PortfolioSkillItem | { name: string } }) {
  const Icon = skillIcons[skill.name]

  return (
    <li className="flex items-center gap-1 rounded-md border border-hue/20 border-solid bg-bg-button-accent/20 px-2 py-0.5 text-xs text-fg-muted print:border-none print:bg-transparent print:p-0 print:text-zinc-800">
      {Icon ? <Icon className="size-4 text-hue" /> : null}
      <span>{skill.name}</span>
    </li>
  )
}

export function PortfolioSidebar({ basics }: { basics: PortfolioBasics }) {
  const printInfo = [basics.email, basics.phone, basics.linkedin].filter(Boolean).join(" • ")
  const showPersonal = import.meta.env.SHOW_PERSONAL

  return (
    <>
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
    </>
  )
}

export function PortfolioProjectsSection({
  projects,
  className,
}: {
  projects: PortfolioViewModel["projects"]
  className?: string
}) {
  if (!projects.length) return null

  return (
    <Section className={className} title="Projects">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 print:flex print:flex-col">
        {projects.map((project) => (
          <article
            key={project.id}
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
                        <IconExternalLink className="size-4" aria-hidden />
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
                  title={`View ${project.name} repository`}
                  aria-label={`View ${project.name} repository`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-75 transition-opacity duration-100 hover:opacity-100"
                >
                  <IconBrandGithub className="size-5" aria-hidden />
                </a>
              ) : null}
            </div>

            <p className="py-3 text-sm text-fg-base">{project.description}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function PortfolioSkillsSection({
  skills,
  className,
}: {
  skills: PortfolioViewModel["skills"]
  className?: string
}) {
  return (
    <Section className={className} title="Skills">
      <ul className="inline-flex flex-wrap gap-6 [&>li]:text-sm">
        {skills.map((skill) => (
          <SkillPill key={skill.id} skill={skill} />
        ))}
      </ul>
    </Section>
  )
}

function EducationList({ education }: { education: PortfolioEducationItem[] }) {
  return (
    <ul className="space-y-4 py-3 print:space-y-0">
      {education.map((item) => {
        const startDate = new Date(item.startDate)
        const endDate = item.endDate ? new Date(item.endDate) : null

        return (
          <div key={item.id} className="flex items-baseline">
            <IconSchool className="mr-2 size-5 text-hue" aria-hidden />
            <div className="relative w-full items-baseline justify-between gap-2">
              <h3 className="mr-6 items-baseline gap-x-2 gap-y-0.5 font-medium">
                {item.url ? (
                  <a
                    target="_blank"
                    className="group flex items-center gap-[6px] decoration-dotted underline-offset-[5px] hover:text-hue hover:underline"
                    href={item.url}
                    rel="noreferrer"
                  >
                    {item.name}
                  </a>
                ) : (
                  <span>{item.name}</span>
                )}
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
  )
}

function CertificatesList({ certificates }: { certificates: PortfolioCertificateItem[] }) {
  if (!certificates.length) return null

  return (
    <>
      <h4>Certificates</h4>
      <ul className="space-y-4 py-3 print:space-y-0">
        {certificates.map((item) => {
          const year = item.date ? new Date(item.date).getFullYear() : "N/A"

          return (
            <div key={item.id} className="flex items-baseline">
              <IconCertificate className="mr-2 size-5 text-hue" aria-hidden />
              <div className="relative w-full items-baseline justify-between gap-2">
                <h3 className="mr-6 items-baseline gap-x-2 gap-y-0.5 font-medium">
                  {item.url ? (
                    <a
                      className="group flex items-center gap-[6px] text-fg-base decoration-dotted underline-offset-[5px] hover:text-hue hover:underline"
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <span>{item.name}</span>
                  )}
                </h3>
                <div className="text-sm text-fg-muted">{item.description}</div>
                <time className="right-0 top-0 text-xs text-fg-muted md:absolute md:block">{year}</time>
              </div>
            </div>
          )
        })}
      </ul>
    </>
  )
}

export function PortfolioEducationSection({
  education,
  certificates,
  className,
}: {
  education: PortfolioViewModel["education"]
  certificates: PortfolioViewModel["certificates"]
  className?: string
}) {
  return (
    <Section className={className} title="Education">
      <EducationList education={education} />
      <CertificatesList certificates={certificates} />
    </Section>
  )
}
