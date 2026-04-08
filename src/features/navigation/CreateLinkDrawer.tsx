import type { CSSProperties } from 'react'
import type { Group } from '../../lib/api'
import { AppIcon } from '../../components/AppIcon'
import { Button } from '../../components/Button'
import { Drawer } from '../../components/Drawer'
import { Input } from '../../components/Input'
import { Select } from '../../components/Select'
import { getFaviconUrl } from '../../lib/favicon'

export type LinkDraft = {
  title: string
  url: string
  icon: string
  iconMode: 'favicon' | 'material' | 'image' | 'text'
  iconImageUrl: string
  iconText: string
  description: string
  tileSize: '1x1' | '1x3'
  groupId: string
  openMode: 'global' | 'same-tab' | 'new-tab'
  backgroundColor: string
}

const segmentShellClassName = 'flex flex-wrap gap-2'
const sectionClassName = 'space-y-4 border-t border-outline pt-5 dark:border-dark-outline'

function getPreviewStyle(backgroundColor: string): CSSProperties | undefined {
  if (!backgroundColor) return undefined
  return { backgroundColor }
}

function LinkPreview({ draft }: { draft: LinkDraft }) {
  const iconOnly = draft.tileSize === '1x1'
  const faviconUrl = getFaviconUrl(draft.url)
  const iconClassName = iconOnly ? 'h-[82%] w-[82%]' : 'h-[74%] w-[74%]'
  const iconFrameClassName = `${iconClassName} flex items-center justify-center overflow-hidden rounded-xl bg-surface-container-low/70 dark:bg-dark-surface-container/70`
  const faviconClassName = `${iconClassName} object-contain ${iconOnly ? 'p-[8%]' : 'p-2.5'}`
  const fallbackText = (draft.iconText || draft.title || '?').trim().slice(0, 2).toUpperCase() || '?'
  const cardStyle = getPreviewStyle(draft.backgroundColor)

  const visual = draft.iconMode === 'image' && draft.iconImageUrl ? (
    <div className={iconFrameClassName}>
      <img src={draft.iconImageUrl} alt="" aria-hidden="true" className={`h-full w-full object-contain ${iconOnly ? 'p-[8%]' : 'p-2.5'}`} />
    </div>
  ) : draft.iconMode === 'material' && draft.icon ? (
    <div className={iconFrameClassName}>
      <AppIcon name={draft.icon} className={`${iconOnly ? 'h-[70%] w-[70%]' : 'h-[60%] w-[60%]'} text-primary dark:text-primary`} />
    </div>
  ) : draft.iconMode === 'text' ? (
    <div className={`${iconFrameClassName} font-bold text-primary dark:text-primary ${iconOnly ? 'text-[1.4rem]' : 'text-sm'}`}>
      {fallbackText}
    </div>
  ) : faviconUrl ? (
    <img src={faviconUrl} alt="" aria-hidden="true" className={faviconClassName} />
  ) : (
    <div className={`${iconFrameClassName} font-bold text-primary dark:text-primary ${iconOnly ? 'text-[1.4rem]' : 'text-sm'}`}>
      {fallbackText}
    </div>
  )

  return (
    <div className="flex justify-center border-b border-outline pb-6 dark:border-dark-outline">
      <div
        style={cardStyle}
        className={`overflow-hidden rounded-xl border border-outline bg-surface text-on-background shadow-sm dark:border-dark-outline dark:bg-dark-surface dark:text-dark-on-background ${iconOnly ? 'flex h-[4.8rem] w-[4.8rem] flex-col items-center justify-center p-[5%]' : 'grid h-[4.8rem] w-[15rem] grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-0 px-2.5 py-2'}`}
      >
        {iconOnly ? (
          <div className="flex h-[90%] w-[90%] items-center justify-center">{visual}</div>
        ) : (
          <>
            <div className="flex h-full w-[4.25rem] items-center justify-center self-stretch">
              <div className="flex h-full w-full items-center justify-center">{visual}</div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center pl-1 pr-1 text-left">
              <div className="truncate text-sm font-semibold">{draft.title || '未命名项目'}</div>
              <div className="mt-0.5 truncate text-xs text-on-surface-variant dark:text-dark-on-surface-variant">{draft.description || draft.url || '这里会显示描述或链接地址'}</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (value: T) => void
}) {
  return (
    <div className={segmentShellClassName}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-xl border px-3 py-2 text-sm transition ${value === option.value ? 'bg-on-background text-white border-on-background dark:bg-dark-on-background dark:text-dark-background dark:border-dark-on-background' : 'bg-transparent border-outline text-on-surface-variant hover:text-on-surface hover:border-on-surface-variant dark:border-dark-outline dark:text-dark-on-surface-variant dark:hover:text-dark-on-surface dark:hover:border-dark-on-surface-variant'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}


export function CreateLinkDrawer({
  open,
  title,
  draft,
  groups,
  pending,
  onOpenChange,
  onDraftChange,
  onSubmit,
  onDelete,
}: {
  open: boolean
  title: string
  draft: LinkDraft
  groups: Group[]
  pending: boolean
  onOpenChange: (open: boolean) => void
  onDraftChange: (next: LinkDraft | ((current: LinkDraft) => LinkDraft)) => void
  onSubmit: () => void
  onDelete?: () => void
}) {
  const setDraft = (next: LinkDraft | ((current: LinkDraft) => LinkDraft)) => {
    onDraftChange(next)
  }

  const hasGroups = groups.length > 0

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title}>
      <div className="flex flex-col gap-6">
        <LinkPreview draft={draft} />

        <div className="space-y-5">
          <div className="space-y-3">
            <h3 className="font-headline text-[0.95rem] tracking-tight text-on-background dark:text-dark-on-background">基础信息</h3>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
              <Input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="标题" maxLength={20} />
              <Input value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} placeholder="描述信息" maxLength={100} />
            </div>
            <div className="grid gap-3 md:grid-cols-[minmax(0,2.3fr)_120px]">
              <Input value={draft.url} onChange={(event) => setDraft((current) => ({ ...current, url: event.target.value }))} placeholder="链接地址 (优先复制)" />
              <Select
                value={draft.groupId}
                onValueChange={(value) => setDraft((current) => ({ ...current, groupId: value }))}
                options={hasGroups ? groups.map((group) => ({ value: group.id, label: group.name })) : [{ value: '', label: '无分组' }]}
                placeholder="选择分组"
                disabled={!hasGroups}
                ariaLabel="选择分组"
                triggerClassName="w-full"
              />
            </div>
          </div>

          <div className={sectionClassName}>
            <h3 className="font-headline text-[0.95rem] tracking-tight text-on-background dark:text-dark-on-background">图标组合</h3>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <SegmentedControl
                value={draft.iconMode}
                onChange={(value) => setDraft((current) => ({ ...current, iconMode: value }))}
                options={[
                  { value: 'favicon', label: '站点图标' },
                  { value: 'material', label: '内置图标' },
                  { value: 'image', label: '图片地址' },
                  { value: 'text', label: '文字' },
                ]}
              />
              <div className="w-full md:max-w-[200px]">
                {draft.iconMode === 'material' ? (
                  <Input value={draft.icon} onChange={(event) => setDraft((current) => ({ ...current, icon: event.target.value }))} placeholder="图标名 (如: home)" />
                ) : null}
                {draft.iconMode === 'image' ? (
                  <Input value={draft.iconImageUrl} onChange={(event) => setDraft((current) => ({ ...current, iconImageUrl: event.target.value }))} placeholder="https://..." />
                ) : null}
                {draft.iconMode === 'text' ? (
                  <Input value={draft.iconText} onChange={(event) => setDraft((current) => ({ ...current, iconText: event.target.value.slice(0, 2) }))} placeholder="1-2字" maxLength={2} />
                ) : null}
                {draft.iconMode === 'favicon' ? <p className="pt-2.5 text-xs text-on-surface-variant dark:text-dark-on-surface-variant">将自动拉取 Favicon</p> : null}
              </div>
            </div>
          </div>

          <div className={sectionClassName}>
            <h3 className="font-headline text-[0.95rem] tracking-tight text-on-background dark:text-dark-on-background">显示属性</h3>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
              <SegmentedControl
                value={draft.tileSize}
                onChange={(value) => setDraft((current) => ({ ...current, tileSize: value }))}
                options={[
                  { value: '1x1', label: '小卡片' },
                  { value: '1x3', label: '宽卡片' },
                ]}
              />
              <SegmentedControl
                value={draft.openMode}
                onChange={(value) => setDraft((current) => ({ ...current, openMode: value }))}
                options={[
                  { value: 'global', label: '跟随配置' },
                  { value: 'same-tab', label: '当前页' },
                  { value: 'new-tab', label: '新页签' },
                ]}
              />
              <div className="flex flex-1 items-center gap-2 min-w-[200px]">
                <div className="relative flex-1">
                  <Input value={draft.backgroundColor} onChange={(event) => setDraft((current) => ({ ...current, backgroundColor: event.target.value }))} placeholder="背景色 (#HEX)" className="!min-h-[38px] py-1.5 pl-3 pr-8 w-full" />
                  {draft.backgroundColor ? (
                    <button
                      type="button"
                      onClick={() => setDraft((current) => ({ ...current, backgroundColor: '' }))}
                      className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-on-surface-variant hover:bg-surface hover:text-on-surface dark:text-dark-on-surface-variant dark:hover:bg-dark-surface dark:hover:text-dark-on-surface"
                      title="恢复默认"
                    >
      <AppIcon name="x" className="text-[16px]" />
                    </button>
                  ) : null}
                </div>
                <input
                  type="color"
                  value={draft.backgroundColor || '#f8fafc'}
                  onChange={(event) => setDraft((current) => ({ ...current, backgroundColor: event.target.value }))}
                  className="h-[38px] w-10 shrink-0 cursor-pointer rounded-xl border border-outline bg-surface p-0.5 dark:border-dark-outline dark:bg-dark-surface"
                />
              </div>
            </div>
          </div>



          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-between">
            <div>
              {onDelete ? (
                <Button variant="danger" onClick={onDelete} disabled={pending}>
                  删除当前链接
                </Button>
              ) : null}
            </div>
            <div className="flex gap-2 sm:justify-end">
              <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={pending}>
                取消
              </Button>
              <Button onClick={onSubmit} disabled={pending || !hasGroups}>
                {pending ? '保存中' : title === '编辑链接' ? '保存' : '创建'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}
