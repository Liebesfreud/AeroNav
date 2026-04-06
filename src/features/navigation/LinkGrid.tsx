import { useState } from 'react'
import type { Group, LinkItem } from '../../lib/api'

type GroupSection = {
  group: Group
  links: LinkItem[]
}

function renderIconFallback(title: string, colorClass: string, sizeClass = 'h-10 w-10') {
  return (
    <div className={`${sizeClass} flex items-center justify-center font-bold text-white ${colorClass}`}>
      {title.charAt(0).toUpperCase()}
    </div>
  )
}

function getBrandColor(url: string | undefined, index: number) {
  const str = (url || '').toLowerCase()
  if (str.includes('youtube')) return 'bg-red-500'
  if (str.includes('twitter') || str.includes('x.com')) return 'bg-sky-500'
  if (str.includes('discord')) return 'bg-indigo-500'
  if (str.includes('github')) return 'bg-slate-800'
  if (str.includes('tiktok')) return 'bg-black'
  if (str.includes('figma')) return 'bg-purple-500'
  if (str.includes('spotify')) return 'bg-emerald-500'
  if (str.includes('mail')) return 'bg-orange-500'
  if (str.includes('music')) return 'bg-emerald-500'

  const colors = [
    'bg-[#3b82f6]', 'bg-[#10b981]', 'bg-[#f59e0b]', 'bg-[#ef4444]',
    'bg-[#8b5cf6]', 'bg-[#ec4899]', 'bg-[#06b6d4]', 'bg-[#f43f5e]',
  ]
  return colors[index % colors.length]
}

function getFaviconUrl(url: string) {
  try {
    return `${new URL(url).origin}/favicon.ico`
  } catch {
    return null
  }
}

function getGridUnit(density: 'compact' | 'comfortable') {
  return density === 'compact' ? '4.5rem' : '5rem'
}

function getTileClassName(tileSize: '1x1' | '1x2', density: 'compact' | 'comfortable') {
  if (tileSize === '1x1') {
    return density === 'compact'
      ? 'col-span-1 row-span-1 h-full w-full items-center justify-center p-2.5'
      : 'col-span-1 row-span-1 h-full w-full items-center justify-center p-3'
  }

  return density === 'compact'
    ? 'col-span-2 row-span-1 h-full w-full items-center gap-3 p-3'
    : 'col-span-2 row-span-1 h-full w-full items-center gap-3.5 p-3.5'
}

function getIconClassName(tileSize: '1x1' | '1x2', density: 'compact' | 'comfortable') {
  if (tileSize === '1x1') {
    return density === 'compact' ? 'h-8 w-8' : 'h-9 w-9'
  }

  return density === 'compact' ? 'h-8 w-8' : 'h-9 w-9'
}

function LinkVisual({
  link,
  index,
  iconClassName,
}: {
  link: LinkItem
  index: number
  iconClassName: string
}) {
  const [faviconFailed, setFaviconFailed] = useState(false)
  const faviconUrl = getFaviconUrl(link.url)

  if (faviconUrl && !faviconFailed) {
    return (
      <img
        src={faviconUrl}
        alt=""
        aria-hidden="true"
        loading="lazy"
        onError={() => setFaviconFailed(true)}
        className={`${iconClassName} shrink-0 object-contain`}
      />
    )
  }

  if (link.icon) {
    return (
      <div className={`${iconClassName} flex shrink-0 items-center justify-center text-white ${getBrandColor(link.url, index)}`}>
        <span className="material-symbols-outlined text-base font-bold">{link.icon}</span>
      </div>
    )
  }

  return renderIconFallback(link.title, getBrandColor(link.url, index), `${iconClassName} shrink-0`)
}

export function LinkGrid({
  sections,
  openInNewTab,
  cardDensity,
  editMode,
  onCreateGroup,
  onEditGroup,
  onDeleteGroup,
  onMoveGroup,
  onCreateLink,
  onEditLink,
  onDeleteLink,
  onMoveLink,
}: {
  sections: GroupSection[]
  openInNewTab: boolean
  cardDensity: 'compact' | 'comfortable'
  editMode: boolean
  onCreateGroup: () => void
  onEditGroup: (group: Group) => void
  onDeleteGroup: (group: Group) => void
  onMoveGroup: (group: Group, direction: -1 | 1) => void
  onCreateLink: (group: Group) => void
  onEditLink: (link: LinkItem) => void
  onDeleteLink: (link: LinkItem) => void
  onMoveLink: (link: LinkItem, direction: -1 | 1) => void
}) {
  if (!sections.length) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-28">
        <div className="rounded-[2rem] border border-dashed border-outline/70 bg-surface/75 px-6 py-16 text-center dark:border-dark-outline/80 dark:bg-dark-surface-elevated/80">
          <p className="font-headline text-2xl font-semibold text-on-background dark:text-dark-on-background">还没有任何分组</p>
          <p className="mt-2 font-body text-sm text-on-surface-variant dark:text-dark-on-surface-variant">先创建一个分组，再把常用链接整理进去。</p>
          {editMode ? (
            <button onClick={onCreateGroup} className="mt-6 inline-flex items-center gap-2 rounded-full bg-on-background px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-dark-on-background dark:text-dark-background">
              <span className="material-symbols-outlined text-lg">create_new_folder</span>
              创建分组
            </button>
          ) : null}
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-24 sm:px-6 lg:px-8 lg:pb-28">
      {editMode ? (
        <div className="flex items-center justify-between rounded-3xl border border-outline/70 bg-surface/75 px-5 py-4 shadow-sm dark:border-dark-outline/80 dark:bg-dark-surface-elevated/80">
          <div>
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant dark:text-dark-on-surface-variant">Workspace sections</p>
            <p className="mt-1 font-body text-sm text-on-surface-variant dark:text-dark-on-surface-variant">管理分组、链接和顺序。</p>
          </div>
          <button onClick={onCreateGroup} className="inline-flex items-center gap-2 rounded-full border border-[#99462a]/20 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-[#99462a]/5 dark:border-accent/30 dark:text-accent dark:hover:bg-accent/10">
            <span className="material-symbols-outlined text-base">create_new_folder</span>
            新建分组
          </button>
        </div>
      ) : null}

      {sections.map((section, groupIndex) => {
        const { group, links } = section

        return (
          <div key={group.id} className="space-y-3 rounded-[1.5rem] border border-outline/70 bg-surface/65 p-4 shadow-sm dark:border-dark-outline/80 dark:bg-dark-surface-elevated/75 sm:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-headline text-xl font-semibold tracking-tight text-on-background dark:text-dark-on-background">{group.name}</h2>
              </div>
              {editMode ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => onMoveGroup(group, -1)} disabled={groupIndex === 0} className="rounded-full border border-outline/80 px-3 py-1.5 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-35 dark:border-dark-outline/80 dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container">
                    上移
                  </button>
                  <button onClick={() => onMoveGroup(group, 1)} disabled={groupIndex === sections.length - 1} className="rounded-full border border-outline/80 px-3 py-1.5 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-35 dark:border-dark-outline/80 dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container">
                    下移
                  </button>
                  <button onClick={() => onCreateLink(group)} className="rounded-full border border-[#99462a]/20 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-[#99462a]/5 dark:border-accent/30 dark:text-accent dark:hover:bg-accent/10">
                    添加链接
                  </button>
                  <button onClick={() => onEditGroup(group)} className="rounded-full border border-outline/80 px-3 py-1.5 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container dark:border-dark-outline/80 dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container">
                    编辑分组
                  </button>
                  <button onClick={() => onDeleteGroup(group)} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/70 dark:text-red-300 dark:hover:bg-red-950/40">
                    删除分组
                  </button>
                </div>
              ) : null}
            </div>

            {links.length ? (
              <div
                className="grid gap-3 overflow-x-auto pb-1"
                style={{
                  gridTemplateColumns: `repeat(auto-fill, minmax(${getGridUnit(cardDensity)}, ${getGridUnit(cardDensity)}))`,
                  gridAutoRows: getGridUnit(cardDensity),
                }}
              >
                {links.map((link, linkIndex) => {
                  const iconOnly = link.tileSize === '1x1'
                  const iconClassName = getIconClassName(link.tileSize, cardDensity)

                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target={openInNewTab ? '_blank' : undefined}
                      rel={openInNewTab ? 'noreferrer' : undefined}
                      title={link.title}
                      aria-label={link.title}
                      className={`group relative flex overflow-hidden rounded-2xl border border-outline/60 bg-surface transition-[box-shadow,border-color,background-color] duration-200 hover:border-primary/25 hover:shadow-[0_0_0_1px_rgba(153,70,42,0.08),0_16px_40px_rgba(15,23,42,0.08)] dark:border-dark-outline/70 dark:bg-dark-surface dark:hover:border-accent/35 dark:hover:shadow-[0_0_0_1px_rgba(217,119,87,0.14),0_18px_46px_rgba(0,0,0,0.36)] ${getTileClassName(link.tileSize, cardDensity)}`}
                    >
                      {editMode ? (
                        <div className="absolute right-2 top-2 z-10 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                          <button onClick={(event) => { event.preventDefault(); onMoveLink(link, -1) }} disabled={linkIndex === 0} className="flex h-7 w-7 items-center justify-center rounded bg-surface-container/95 text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-35 dark:bg-dark-surface-container/95 dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-elevated" aria-label={`上移 ${link.title}`}>
                            <span className="material-symbols-outlined text-xs">arrow_upward</span>
                          </button>
                          <button onClick={(event) => { event.preventDefault(); onMoveLink(link, 1) }} disabled={linkIndex === links.length - 1} className="flex h-7 w-7 items-center justify-center rounded bg-surface-container/95 text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-35 dark:bg-dark-surface-container/95 dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-elevated" aria-label={`下移 ${link.title}`}>
                            <span className="material-symbols-outlined text-xs">arrow_downward</span>
                          </button>
                          <button onClick={(event) => { event.preventDefault(); onEditLink(link) }} className="flex h-7 w-7 items-center justify-center rounded bg-surface-container/95 text-on-surface-variant transition-colors hover:bg-[#99462a]/10 hover:text-[#99462a] dark:bg-dark-surface-container/95 dark:text-dark-on-surface-variant dark:hover:bg-accent/15 dark:hover:text-accent" aria-label={`编辑 ${link.title}`}>
                            <span className="material-symbols-outlined text-xs">edit</span>
                          </button>
                          <button onClick={(event) => { event.preventDefault(); onDeleteLink(link) }} className="flex h-7 w-7 items-center justify-center rounded bg-surface-container/95 text-on-surface-variant transition-colors hover:bg-red-50 hover:text-red-500 dark:bg-dark-surface-container/95 dark:text-dark-on-surface-variant dark:hover:bg-red-950/40 dark:hover:text-red-300" aria-label={`删除 ${link.title}`}>
                            <span className="material-symbols-outlined text-xs">delete</span>
                          </button>
                        </div>
                      ) : null}
                      <LinkVisual link={link} index={linkIndex} iconClassName={iconClassName} />
                      {!iconOnly ? (
                        <div className="min-w-0 flex-1 pr-8">
                          <h3 className="truncate font-headline text-sm font-semibold tracking-tight text-on-background dark:text-dark-on-background">{link.title}</h3>
                          <p className="mt-1 truncate text-xs text-on-surface-variant dark:text-dark-on-surface-variant">{link.description || link.url}</p>
                        </div>
                      ) : null}
                    </a>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-outline/70 bg-surface/70 px-5 py-10 text-center dark:border-dark-outline/80 dark:bg-dark-surface-elevated/75">
                <p className="font-headline text-xl font-semibold text-on-background dark:text-dark-on-background">这个分组还没有链接</p>
                <p className="mt-2 text-sm text-on-surface-variant dark:text-dark-on-surface-variant">添加第一个链接，开始整理你的常用入口。</p>
                {editMode ? (
                  <button onClick={() => onCreateLink(group)} className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#99462a]/20 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-[#99462a]/5 dark:border-accent/30 dark:text-accent dark:hover:bg-accent/10">
                    <span className="material-symbols-outlined text-base">add</span>
                    添加链接
                  </button>
                ) : null}
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}
