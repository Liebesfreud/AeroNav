import { Button } from '../../components/Button'
import { ConfirmDialog } from '../../components/ConfirmDialog'

export function DeleteLinkDialog({
  open,
  title,
  description,
  pending,
  errorMessage,
  onOpenChange,
  onCancel,
  onConfirm,
}: {
  open: boolean
  title: string
  description: string
  pending: boolean
  errorMessage: string | null
  onOpenChange: (open: boolean) => void
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      actions={
        <div className="flex w-full items-center justify-between gap-3">
          <div className="min-h-5 text-sm text-red-500">{errorMessage ?? ''}</div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onCancel} disabled={pending}>取消</Button>
            <Button variant="danger" onClick={onConfirm} disabled={pending}>{pending ? '删除中' : '删除'}</Button>
          </div>
        </div>
      }
    />
  )
}
