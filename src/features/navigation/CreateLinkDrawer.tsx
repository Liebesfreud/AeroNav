import type { Group } from '../../lib/api'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Drawer } from '../../components/Drawer'

export type LinkDraft = {
  title: string
  url: string
  icon: string
  description: string
  tileSize: '1x1' | '1x2'
  groupId: string
  pinned: boolean
  archived: boolean
}

const fieldClassName = 'min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent-400 focus:ring-4 focus:ring-accent-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-accent-500 dark:focus:ring-accent-950'

export function CreateLinkDrawer({
  open,
  title,
  draft,
  groups,
  pending,
  errorMessage,
  onOpenChange,
  onDraftChange,
  onSubmit,
}: {
  open: boolean
  title: string
  draft: LinkDraft
  groups: Group[]
  pending: boolean
  errorMessage: string | null
  onOpenChange: (open: boolean) => void
  onDraftChange: (next: LinkDraft | ((current: LinkDraft) => LinkDraft)) => void
  onSubmit: () => void
}) {
  const setDraft = (next: LinkDraft | ((current: LinkDraft) => LinkDraft)) => {
    onDraftChange(next)
  }

  const hasGroups = groups.length > 0

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title}>
      <div className="space-y-4 p-1">
        <Input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="标题" />
        <Input value={draft.url} onChange={(event) => setDraft((current) => ({ ...current, url: event.target.value }))} placeholder="https://example.com" />
        <Input value={draft.icon} onChange={(event) => setDraft((current) => ({ ...current, icon: event.target.value }))} placeholder="Material Symbols 图标名（如：mail）" />
        <textarea
          value={draft.description}
          onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
          placeholder="描述（可选）"
          rows={4}
          className={fieldClassName}
        />
        <select
          value={draft.tileSize}
          onChange={(event) => setDraft((current) => ({ ...current, tileSize: event.target.value as '1x1' | '1x2' }))}
          className={fieldClassName}
        >
          <option value="1x1">1x1 · 仅图标</option>
          <option value="1x2">1x2 · 图标 + 标题</option>
        </select>
        <p className="-mt-2 text-xs text-slate-500 dark:text-slate-400">优先显示网站 favicon，没有时回退到自定义图标或首字母。</p>
        <select
          value={draft.groupId}
          onChange={(event) => setDraft((current) => ({ ...current, groupId: event.target.value }))}
          className={fieldClassName}
          disabled={!hasGroups}
        >
          {hasGroups ? groups.map((group) => (
            <option key={group.id} value={group.id}>{group.name}</option>
          )) : <option value="">请先创建分组</option>}
        </select>
        <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">
          <span>置顶链接</span>
          <input type="checkbox" checked={draft.pinned} onChange={(event) => setDraft((current) => ({ ...current, pinned: event.target.checked }))} className="h-4 w-4" />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">
          <span>归档链接</span>
          <input type="checkbox" checked={draft.archived} onChange={(event) => setDraft((current) => ({ ...current, archived: event.target.checked }))} className="h-4 w-4" />
        </label>
        {!hasGroups ? <p className="text-sm text-amber-600">请先创建至少一个分组。</p> : null}
        {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={pending}>取消</Button>
          <Button onClick={onSubmit} disabled={pending || !hasGroups}>{pending ? '保存中' : title === '编辑链接' ? '保存' : '创建'}</Button>
        </div>
      </div>
    </Drawer>
  )
}
