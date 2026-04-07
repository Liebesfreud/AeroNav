import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'

export function Drawer({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-on-background/16 backdrop-blur-[2px] dark:bg-black/36" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[min(88vh,52rem)] w-[min(calc(100vw-1.5rem),46rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[1.1rem] border border-outline/60 bg-surface p-4 shadow-[0_18px_46px_-30px_rgba(15,23,42,0.22)] outline-none dark:border-dark-outline/70 dark:bg-dark-surface-elevated sm:p-5">
          <Dialog.Title className="shrink-0 border-b border-outline/50 pb-3 font-headline text-lg font-semibold tracking-tight text-on-background dark:border-dark-outline/60 dark:text-dark-on-background">
            {title}
          </Dialog.Title>
          <div className="mt-4 max-h-[calc(88vh-5.5rem)] overflow-y-auto pr-1">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
