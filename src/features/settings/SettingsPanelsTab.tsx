import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api, ApiError, type WebPanel, type WebPanelCreatePayload, type WebPanelUpdatePayload } from '../../lib/api'
import { useBootstrapCache } from '../../hooks/useBootstrap'
import { AppIcon } from '../../components/AppIcon'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Select } from '../../components/Select'
import { Drawer } from '../../components/Drawer'
import { ConfirmDialog } from '../../components/ConfirmDialog'

type SettingsPanelsTabProps = {
  panels: WebPanel[]
}

type PanelFormData = {
  title: string
  url: string
  icon: string
  description: string
  openMode: 'iframe' | 'external'
  enabled: boolean
}

const emptyForm: PanelFormData = {
  title: '',
  url: '',
  icon: '',
  description: '',
  openMode: 'iframe',
  enabled: true,
}

function validateUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'URL 不能为空。'
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return '仅支持 http 或 https 地址。'
    }
    return null
  } catch {
    return '请输入有效的 URL。'
  }
}

export function SettingsPanelsTab({ panels }: SettingsPanelsTabProps) {
  const { update } = useBootstrapCache()

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingPanel, setEditingPanel] = useState<WebPanel | null>(null)
  const [form, setForm] = useState<PanelFormData>(emptyForm)
  const [urlError, setUrlError] = useState<string | null>(null)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<WebPanel | null>(null)

  const resetForm = useCallback(() => {
    setForm(emptyForm)
    setEditingPanel(null)
    setUrlError(null)
    setTitleError(null)
    setMutationError(null)
  }, [])

  const openAdd = useCallback(() => {
    resetForm()
    setDrawerOpen(true)
  }, [resetForm])

  const openEdit = useCallback((panel: WebPanel) => {
    setEditingPanel(panel)
    setForm({
      title: panel.title,
      url: panel.url,
      icon: panel.icon ?? '',
      description: panel.description ?? '',
      openMode: panel.openMode,
      enabled: panel.enabled,
    })
    setUrlError(null)
    setTitleError(null)
    setMutationError(null)
    setDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    resetForm()
  }, [resetForm])

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: WebPanelCreatePayload) => api.createPanel(payload),
    onSuccess: ({ panels }) => {
      update({ panels })
      closeDrawer()
    },
    onError: (error) => {
      setMutationError(error instanceof ApiError ? error.message : '创建失败，请稍后重试。')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: WebPanelUpdatePayload }) => api.updatePanel(id, payload),
    onSuccess: ({ panels }) => {
      update({ panels })
      closeDrawer()
    },
    onError: (error) => {
      setMutationError(error instanceof ApiError ? error.message : '更新失败，请稍后重试。')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deletePanel(id),
    onSuccess: ({ panels }) => {
      update({ panels })
      setDeleteTarget(null)
    },
    onError: (error) => {
      setDeleteTarget(null)
      // eslint-disable-next-line no-console
      console.error('Delete panel failed:', error)
    },
  })

  const reorderMutation = useMutation({
    mutationFn: (next: WebPanel[]) => api.reorderPanels({ panels: next.map((p, i) => ({ id: p.id, sortOrder: i })) }),
    onSuccess: ({ panels }) => {
      update({ panels })
    },
  })

  const toggleEnabledMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => api.updatePanel(id, { enabled }),
    onSuccess: ({ panels }) => {
      update({ panels })
    },
  })

  // Handlers
  const handleSubmit = () => {
    setMutationError(null)

    const trimmedTitle = form.title.trim()
    if (!trimmedTitle) {
      setTitleError('标题不能为空。')
      return
    }
    setTitleError(null)

    const urlErr = validateUrl(form.url)
    if (urlErr) {
      setUrlError(urlErr)
      return
    }
    setUrlError(null)

    const payload = {
      title: trimmedTitle,
      url: form.url.trim(),
      icon: form.icon.trim() || null,
      description: form.description.trim() || null,
      openMode: form.openMode,
      enabled: form.enabled,
    }

    if (editingPanel) {
      updateMutation.mutate({ id: editingPanel.id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleMoveUp = (index: number) => {
    if (index <= 0) return
    const next = [...panels]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    reorderMutation.mutate(next)
  }

  const handleMoveDown = (index: number) => {
    if (index >= panels.length - 1) return
    const next = [...panels]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    reorderMutation.mutate(next)
  }

  const pending = createMutation.isPending || updateMutation.isPending

  return (
    <>
      <div className="rounded-xl border border-outline bg-surface px-4 py-4 dark:border-dark-outline dark:bg-dark-surface">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center text-on-surface-variant dark:text-dark-on-surface-variant">
              <AppIcon name="layout-dashboard" className="h-[18px] w-[18px]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">Web 面板</p>
              <p className="mt-0.5 text-xs text-on-surface-variant dark:text-dark-on-surface-variant">管理导航栏中嵌入的网页面板。</p>
            </div>
          </div>
          <Button onClick={openAdd}>添加面板</Button>
        </div>
      </div>

      {panels.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline/60 px-4 py-8 text-center dark:border-dark-outline/60">
          <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">暂无面板，点击上方按钮添加。</p>
        </div>
      ) : (
        <div className="space-y-2">
          {panels.map((panel, index) => (
            <div
              key={panel.id}
              className={`rounded-xl border bg-surface px-4 py-3 dark:bg-dark-surface ${panel.enabled ? 'border-outline dark:border-dark-outline' : 'border-outline/50 opacity-60 dark:border-dark-outline/50'}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center text-on-surface-variant dark:text-dark-on-surface-variant">
                  {panel.icon ? <AppIcon name={panel.icon} className="h-[18px] w-[18px]" /> : <AppIcon name="panel-left" className="h-[18px] w-[18px]" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-on-surface dark:text-dark-on-surface">{panel.title}</p>
                  <p className="truncate text-xs text-on-surface-variant dark:text-dark-on-surface-variant">{panel.url}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    title="上移"
                    disabled={index === 0 || reorderMutation.isPending}
                    onClick={() => handleMoveUp(index)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-background disabled:cursor-not-allowed disabled:opacity-30 dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container/70 dark:hover:text-dark-on-background"
                  >
                    <AppIcon name="chevron-up" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="下移"
                    disabled={index === panels.length - 1 || reorderMutation.isPending}
                    onClick={() => handleMoveDown(index)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-background disabled:cursor-not-allowed disabled:opacity-30 dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container/70 dark:hover:text-dark-on-background"
                  >
                    <AppIcon name="chevron-down" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-pressed={panel.enabled}
                    title={panel.enabled ? '已启用' : '已禁用'}
                    onClick={() => toggleEnabledMutation.mutate({ id: panel.id, enabled: !panel.enabled })}
                    disabled={toggleEnabledMutation.isPending}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${panel.enabled ? 'bg-primary dark:bg-accent' : 'bg-outline/80 dark:bg-dark-outline'}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${panel.enabled ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                  <button
                    type="button"
                    title="编辑"
                    onClick={() => openEdit(panel)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-background dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container/70 dark:hover:text-dark-on-background"
                  >
                    <AppIcon name="pencil" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="删除"
                    onClick={() => setDeleteTarget(panel)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  >
                    <AppIcon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Drawer */}
      <Drawer open={drawerOpen} onOpenChange={(open) => { if (!open) closeDrawer() }} title={editingPanel ? '编辑面板' : '添加面板'}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface dark:text-dark-on-surface">标题</label>
            <Input
              value={form.title}
              onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); if (titleError) setTitleError(null) }}
              placeholder="面板标题"
            />
            {titleError ? <p className="text-xs text-red-500">{titleError}</p> : null}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface dark:text-dark-on-surface">URL</label>
            <Input
              type="url"
              inputMode="url"
              value={form.url}
              onChange={(e) => { setForm((f) => ({ ...f, url: e.target.value })); if (urlError) setUrlError(null) }}
              placeholder="https://example.com"
            />
            {urlError ? <p className="text-xs text-red-500">{urlError}</p> : null}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface dark:text-dark-on-surface">图标 <span className="font-normal text-on-surface-variant dark:text-dark-on-surface-variant">(可选)</span></label>
            <Input
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              placeholder="图标名称，如 globe"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface dark:text-dark-on-surface">描述 <span className="font-normal text-on-surface-variant dark:text-dark-on-surface-variant">(可选)</span></label>
            <Input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="面板描述"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface dark:text-dark-on-surface">打开方式</label>
            <Select
              value={form.openMode}
              onValueChange={(value: 'iframe' | 'external') => setForm((f) => ({ ...f, openMode: value }))}
              options={[
                { value: 'iframe', label: '内嵌 (iframe)' },
                { value: 'external', label: '新标签页' },
              ]}
              ariaLabel="打开方式"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-on-surface dark:text-dark-on-surface">启用</p>
            </div>
            <button
              type="button"
              aria-pressed={form.enabled}
              onClick={() => setForm((f) => ({ ...f, enabled: !f.enabled }))}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${form.enabled ? 'bg-primary dark:bg-accent' : 'bg-outline/80 dark:bg-dark-outline'}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${form.enabled ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>

          {mutationError ? <p className="text-sm text-red-500">{mutationError}</p> : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={closeDrawer} disabled={pending}>取消</Button>
            <Button onClick={handleSubmit} disabled={pending}>
              {pending ? '保存中' : editingPanel ? '保存' : '创建'}
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="删除面板"
        description={`确定要删除面板「${deleteTarget?.title ?? ''}」吗？此操作不可撤销。`}
        actions={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={deleteMutation.isPending}>取消</Button>
            <Button variant="danger" onClick={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id) }} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? '删除中' : '删除'}
            </Button>
          </>
        }
      />
    </>
  )
}
