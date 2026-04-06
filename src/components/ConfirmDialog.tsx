import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  actions,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  actions: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-2xl outline-none dark:border-slate-800 dark:bg-slate-950">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</Dialog.Description>
          <div className="mt-5 flex justify-end gap-2">{actions}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
