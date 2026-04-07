import { useState, type CSSProperties, type DragEvent } from 'react'
import { Button } from '../../components/Button'
import type { Group, LinkItem } from '../../lib/api'

type GroupSection = {
  group: Group
  links: LinkItem[]
}

function renderTextFallback(text: string, colorClass: string, sizeClass: string, textClassName = 'text-sm') {
  return (
    <div className={`${sizeClass} flex items-center justify-center rounded-2xl font-bold text-white ${colorClass} ${textClassName}`}>
      {text.trim().slice(0, 2).toUpperCase() || '?'}
    </div>
  )
}

function getBrandColor(url: string | undefined, index: number) {
  const str = (url || '').toLowerCase()
  if (str.includes('youtube')) return 'bg-red-500'
  if (str.includes('twitter') || str.includes('x.com')) return 'bg-slate-700'
  if (str.includes('discord')) return 'bg-indigo-500'
  if (str.includes('github')) return 'bg-slate-800'
  if (str.includes('figma')) return 'bg-purple-500'
  if (str.includes('spotify')) return 'bg-emerald-600'

  const colors = ['bg-slate-700', 'bg-stone-700', 'bg-zinc-700', 'bg-neutral-700', 'bg-gray-700']
  return colors[index % colors.length]
}

function getFaviconUrl(url: string) {
  try {
    return `${new URL(url).origin}/favicon.ico`
  } catch {
    return null
  }
}

function getTileClassName(tileSize: '1x1' | '1x3', density: 'compact' | 'comfortable') {
  if (tileSize === '1x1') {
    return density === 'compact'
      ? 'col-span-1 row-span-1 flex h-full w-full items-center justify-center p-1.5'
      : 'col-span-1 row-span-1 flex h-full w-full items-center justify-center p-2'
  }

  return density === 'compact'
    ? 'col-span-3 row-span-1 flex h-full w-full items-center gap-2 px-2 py-2 text-left'
    : 'col-span-3 row-span-1 flex h-full w-full items-center gap-2.5 px-2.5 py-2.5 text-left'
}



function getCardStyle(backgroundColor: string | null): CSSProperties | undefined {
  if (!backgroundColor) return undefined
  return { backgroundColor }
}

function getLinkTarget(openMode: 'global' | 'same-tab' | 'new-tab', openInNewTab: boolean) {
  if (openMode === 'same-tab') return undefined
  if (openMode === 'new-tab') return '_blank'
  return openInNewTab ? '_blank' : undefined
}

function reorderIds(ids: string[], activeId: string, overId: string) {
  if (activeId === overId) return ids
  const next = [...ids]
  const fromIndex = next.indexOf(activeId)
  const toIndex = next.indexOf(overId)
  if (fromIndex === -1 || toIndex === -1) return ids
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

function LinkVisual({
  link,
  index,
  iconClassName,
  glyphClassName,
  imagePaddingClassName,
  fallbackTextClassName,
}: {
  link: LinkItem
  index: number
  iconClassName: string
  glyphClassName: string
  imagePaddingClassName: string
  fallbackTextClassName: string
}) {
  const [faviconFailed, setFaviconFailed] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const faviconUrl = getFaviconUrl(link.url)
  const fallbackText = link.iconText || link.title.slice(0, 2) || '?'
  const brandColor = getBrandColor(link.url, index)

  if (link.iconMode === 'image' && link.iconImageUrl && !imageFailed) {
    return (
      <div className={`${iconClassName} flex shrink-0 items-center justify-center overflow-hidden rounded-2xl`}>
        <img
          src={link.iconImageUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={() => setImageFailed(true)}
          className={`h-full w-full object-contain ${imagePaddingClassName}`}
        />
      </div>
    )
  }

  if (link.iconMode === 'material' && link.icon) {
    return (
      <div className={`${iconClassName} flex shrink-0 items-center justify-center rounded-2xl text-white ${brandColor}`}>
        <span className={`material-symbols-outlined font-bold ${glyphClassName}`}>{link.icon}</span>
      </div>
    )
  }

  if (link.iconMode === 'text') {
    return renderTextFallback(fallbackText, brandColor, `${iconClassName} shrink-0`, fallbackTextClassName)
  }

  if (faviconUrl && !faviconFailed) {
    return (
      <div className={`${iconClassName} flex shrink-0 items-center justify-center overflow-hidden rounded-2xl`}>
        <img
          src={faviconUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={() => setFaviconFailed(true)}
          className={`h-full w-full object-contain ${imagePaddingClassName}`}
        />
      </div>
    )
  }

  return renderTextFallback(fallbackText, brandColor, `${iconClassName} shrink-0`, fallbackTextClassName)
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
  onReorderLinks,
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
  onReorderLinks: (groupId: string, orderedLinkIds: string[]) => void
}) {
  const [draggingLinkId, setDraggingLinkId] = useState<string | null>(null)
  const [dragOverLinkId, setDragOverLinkId] = useState<string | null>(null)

  const handleDragStart = (event: DragEvent<HTMLButtonElement>, linkId: string) => {
    setDraggingLinkId(linkId)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', linkId)
  }

  const handleDragOver = (event: DragEvent<HTMLButtonElement>, linkId: string) => {
    event.preventDefault()
    if (!draggingLinkId || draggingLinkId === linkId) return
    setDragOverLinkId(linkId)
  }

  const handleDrop = (groupId: string, linkIds: string[], overLinkId: string) => {
    if (!draggingLinkId) return
    const ordered = reorderIds(linkIds, draggingLinkId, overLinkId)
    setDraggingLinkId(null)
    setDragOverLinkId(null)
    if (ordered !== linkIds) onReorderLinks(groupId, ordered)
  }

  const clearDragState = () => {
    setDraggingLinkId(null)
    setDragOverLinkId(null)
  }

  if (!sections.length) {
    return (
      <section className="mx-auto w-full max-w-[110rem] px-2 pb-24 sm:px-3 lg:px-4 lg:pb-28">
        <div className="rounded-xl border border-dashed border-outline/50 bg-surface/60 px-6 py-16 text-center dark:border-dark-outline/60 dark:bg-dark-surface-elevated/65">
          <p className="font-headline text-2xl font-semibold text-on-background dark:text-dark-on-background">还没有任何分组</p>
          <p className="mt-2 font-body text-sm text-on-surface-variant dark:text-dark-on-surface-variant">先创建一个分组，再把常用链接整理进去。</p>
          {editMode ? (
            <div className="mt-6 flex justify-center">
              <Button onClick={onCreateGroup}>
                <span className="material-symbols-outlined mr-2 text-lg">create_new_folder</span>
                创建分组
              </Button>
            </div>
          ) : null}
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto flex w-full max-w-[110rem] flex-col gap-6 px-2 pb-24 sm:px-3 lg:px-4 lg:pb-28">
      {editMode ? (
        <div className="flex flex-col gap-3 border-b border-outline/50 pb-4 dark:border-dark-outline/60 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant dark:text-dark-on-surface-variant">编辑模式</p>
            <p className="mt-1 text-sm text-on-surface-variant dark:text-dark-on-surface-variant">点击卡片编辑，拖动卡片调整顺序。</p>
          </div>
          <Button variant="secondary" onClick={onCreateGroup}>
            <span className="material-symbols-outlined mr-2 text-base">create_new_folder</span>
            新建分组
          </Button>
        </div>
      ) : null}

      {sections.map((section, groupIndex) => {
        const { group, links } = section
        const linkIds = links.map((link) => link.id)

        return (
          <section key={group.id} className="space-y-4 border-b border-outline/40 pb-6 dark:border-dark-outline/50">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  {group.icon ? (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-primary dark:bg-dark-surface-container/70 dark:text-accent">
                      <span className="material-symbols-outlined text-[20px]">{group.icon}</span>
                    </div>
                  ) : null}
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold tracking-tight text-on-background dark:text-dark-on-background">{group.name}</h2>
                  </div>
                </div>
                {editMode ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="ghost" onClick={() => onMoveGroup(group, -1)} disabled={groupIndex === 0} className="min-h-9 px-3 py-1.5 text-xs">
                      上移
                    </Button>
                    <Button variant="ghost" onClick={() => onMoveGroup(group, 1)} disabled={groupIndex === sections.length - 1} className="min-h-9 px-3 py-1.5 text-xs">
                      下移
                    </Button>
                    <Button variant="secondary" onClick={() => onCreateLink(group)} className="min-h-9 px-3 py-1.5 text-xs">
                      添加链接
                    </Button>
                    <Button variant="ghost" onClick={() => onEditGroup(group)} className="min-h-9 px-3 py-1.5 text-xs">
                      编辑
                    </Button>
                    <Button variant="danger" onClick={() => onDeleteGroup(group)} className="min-h-9 px-3 py-1.5 text-xs">
                      删除
                    </Button>
                  </div>
                ) : null}
              </div>

              {links.length ? (
                <div
                  className="nav-link-grid grid gap-3 pb-1"
                  style={{
                    minWidth: '0',
                  }}
                >
                  {links.map((link, linkIndex) => {
                    const iconOnly = link.tileSize === '1x1'
                    const iconClassName = cardDensity === 'compact' ? 'h-12 w-12' : 'h-14 w-14'
                    const glyphClassName = cardDensity === 'compact' ? 'text-[2.15rem]' : 'text-[2.4rem]'
                    const imagePaddingClassName = 'p-0.5'
                    const fallbackTextClassName = cardDensity === 'compact' ? 'text-xl' : 'text-2xl'
                    const target = getLinkTarget(link.openMode, openInNewTab)
                    const isDragging = draggingLinkId === link.id
                    const isDragOver = dragOverLinkId === link.id
                    const sharedClassName = `${editMode ? 'cursor-pointer' : ''} group relative overflow-hidden rounded-xl border border-outline bg-surface transition-[border-color,background-color,transform,box-shadow,opacity] duration-200 dark:border-dark-outline dark:bg-dark-surface ${editMode ? 'hover:border-outline-strong hover:bg-surface-container/60 hover:shadow-card dark:hover:bg-dark-surface-container/60' : 'hover:border-outline-strong hover:bg-surface-container/60 hover:shadow-card dark:hover:bg-dark-surface-container/60'} ${isDragging ? 'scale-[0.98] opacity-60 bg-surface-container dark:bg-dark-surface-container' : ''} ${isDragOver ? 'border-primary ring-1 ring-primary/20 dark:border-accent dark:ring-accent/20' : ''} ${getTileClassName(link.tileSize, cardDensity)}`

                    const content = iconOnly ? (
                      <LinkVisual
                        link={link}
                        index={linkIndex}
                        iconClassName={iconClassName}
                        glyphClassName={glyphClassName}
                        imagePaddingClassName={imagePaddingClassName}
                        fallbackTextClassName={fallbackTextClassName}
                      />
                    ) : (
                      <>
                        <LinkVisual
                          link={link}
                          index={linkIndex}
                          iconClassName={cardDensity === 'compact' ? 'h-10 w-10' : 'h-11 w-11'}
                          glyphClassName={cardDensity === 'compact' ? 'text-[1.8rem]' : 'text-[2rem]'}
                          imagePaddingClassName={imagePaddingClassName}
                          fallbackTextClassName={cardDensity === 'compact' ? 'text-lg' : 'text-xl'}
                        />
                        <div className="min-w-0 flex-1 text-left">
                          <h3 className="truncate text-base font-semibold tracking-tight text-on-background dark:text-dark-on-background sm:text-[1.05rem]">{link.title}</h3>
                          <p className="mt-0.5 truncate whitespace-nowrap text-[11px] leading-4 text-on-surface-variant dark:text-dark-on-surface-variant">{link.description || link.url}</p>
                        </div>
                      </>
                    )

                    if (editMode) {
                      return (
                        <button
                          key={link.id}
                          type="button"
                          draggable
                          onClick={() => onEditLink(link)}
                          onDragStart={(event) => handleDragStart(event, link.id)}
                          onDragOver={(event) => handleDragOver(event, link.id)}
                          onDrop={() => handleDrop(group.id, linkIds, link.id)}
                          onDragEnd={clearDragState}
                          onDragLeave={() => {
                            if (dragOverLinkId === link.id) setDragOverLinkId(null)
                          }}
                          title={`编辑 ${link.title}`}
                          aria-label={`编辑 ${link.title}`}
                          style={getCardStyle(link.backgroundColor)}
                          className={sharedClassName}
                        >
                          {content}
                        </button>
                      )
                    }

                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target={target}
                        rel={target === '_blank' ? 'noreferrer' : undefined}
                        title={link.title}
                        aria-label={link.title}
                        style={getCardStyle(link.backgroundColor)}
                        className={sharedClassName}
                      >
                        {content}
                      </a>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-outline/45 bg-surface-container-low/45 px-5 py-10 text-center dark:border-dark-outline/55 dark:bg-dark-surface-container/35">
                  <p className="text-lg font-semibold text-on-background dark:text-dark-on-background">这个分组还没有链接</p>
                  <p className="mt-2 text-sm text-on-surface-variant dark:text-dark-on-surface-variant">添加第一个链接，开始整理你的常用入口。</p>
                  {editMode ? (
                    <div className="mt-5 flex justify-center">
                      <Button variant="secondary" onClick={() => onCreateLink(group)}>
                        <span className="material-symbols-outlined mr-2 text-base">add</span>
                        添加链接
                      </Button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </section>
        )
      })}
    </section>
  )
}
