import { Button } from '../../components/Button'
import { Drawer } from '../../components/Drawer'
import { Input } from '../../components/Input'

export type GroupDraft = {
  name: string
  icon: string
}

export function GroupDrawer({
  open,
  title,
  draft,
  pending,
  errorMessage,
  onOpenChange,
  onDraftChange,
  onSubmit,
}: {
  open: boolean
  title: string
  draft: GroupDraft
  pending: boolean
  errorMessage: string | null
  onOpenChange: (open: boolean) => void
  onDraftChange: (next: GroupDraft | ((current: GroupDraft) => GroupDraft)) => void
  onSubmit: () => void
}) {
  const setDraft = (next: GroupDraft | ((current: GroupDraft) => GroupDraft)) => {
    onDraftChange(next)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title}>
      <div className="space-y-4 p-1">
        <Input
          value={draft.name}
          onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
          placeholder="分组名称"
        />
        <Input
          value={draft.icon}
          onChange={(event) => setDraft((current) => ({ ...current, icon: event.target.value }))}
          placeholder="Material Symbols 图标名（如：folder）"
        />
        {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={pending}>取消</Button>
          <Button onClick={onSubmit} disabled={pending}>{pending ? '保存中' : title === '编辑分组' ? '保存' : '创建'}</Button>
        </div>
      </div>
    </Drawer>
  )
}
