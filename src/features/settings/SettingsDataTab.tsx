import { useRef } from 'react'
import { AppIcon } from '../../components/AppIcon'
import { Button } from '../../components/Button'

type SettingsDataTabProps = {
  importPending: boolean
  importError: string | null
  onExport: () => void
  onImportFile: (file: File | null) => void
}

export function SettingsDataTab({ importPending, importError, onExport, onImportFile }: SettingsDataTabProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <div className="rounded-xl border border-outline bg-surface px-4 py-4 dark:border-dark-outline dark:bg-dark-surface">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-on-surface-variant dark:text-dark-on-surface-variant">
              <AppIcon name="download" className="h-[18px] w-[18px]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">导出配置</p>
            </div>
          </div>
          <Button onClick={onExport}>导出</Button>
        </div>
      </div>

      <div className="rounded-xl border border-outline bg-surface px-4 py-4 dark:border-dark-outline dark:bg-dark-surface">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-on-surface-variant dark:text-dark-on-surface-variant">
              <AppIcon name="upload" className="h-[18px] w-[18px]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">恢复备份</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={importPending}>
            {importPending ? '导入中' : '导入'}
          </Button>
        </div>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(event) => onImportFile(event.target.files?.[0] ?? null)} />
        {importError ? <p className="mt-3 text-sm text-red-500">{importError}</p> : null}
      </div>
    </>
  )
}
