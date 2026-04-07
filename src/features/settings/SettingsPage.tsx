import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api, ApiError, exportPayloadSchema, type Settings } from '../../lib/api'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { PageContainer } from '../../components/layout/PageContainer'
import { applyTheme } from '../../lib/theme'
import { useBootstrapCache, useBootstrapQuery } from '../../hooks/useBootstrap'

type SettingToggleCardProps = {
  icon: string
  title: string
  checked: boolean
  disabled?: boolean
  onToggle: () => void
}

type SegmentedOption<T extends string> = {
  value: T
  label: string
}

type SegmentedControlProps<T extends string> = {
  icon: string
  title: string
  value: T
  options: SegmentedOption<T>[]
  disabled?: boolean
  onChange: (value: T) => void
}

type NumberControlProps = {
  icon: string
  title: string
  value: number
  min: number
  max: number
  suffix?: string
  disabled?: boolean
  onChange: (value: number) => void
}

type SettingsTab = 'user' | 'appearance' | 'navigation' | 'weather' | 'data'

const settingTabs: Array<{ value: SettingsTab; label: string; icon: string }> = [
  { value: 'user', label: '用户', icon: 'account_circle' },
  { value: 'appearance', label: '外观', icon: 'palette' },
  { value: 'navigation', label: '导航', icon: 'travel_explore' },
  { value: 'weather', label: '天气', icon: 'partly_cloudy_day' },
  { value: 'data', label: '数据', icon: 'database' },
]

const sectionItemClassName = 'rounded-xl border border-outline bg-surface px-4 py-4 dark:border-dark-outline dark:bg-dark-surface'
const rowIconClassName = 'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-on-surface-variant dark:text-dark-on-surface-variant'

function SettingSection({
  icon,
  title,
  children,
}: {
  icon: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b border-outline pb-2 dark:border-dark-outline">
        <span className="material-symbols-outlined text-[18px] text-primary dark:text-accent">{icon}</span>
        <div className="min-w-0">
          <h2 className="font-headline text-lg font-normal tracking-tight text-on-background dark:text-dark-on-background sm:text-xl">{title}</h2>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function SettingToggleCard({ icon, title, checked, disabled = false, onToggle }: SettingToggleCardProps) {
  return (
    <div className={`${sectionItemClassName} flex items-center justify-between gap-3`}>
      <div className="flex min-w-0 items-center gap-3">
        <div className={rowIconClassName}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">{title}</p>
        </div>
      </div>
      <button
        type="button"
        aria-pressed={checked}
        onClick={onToggle}
        disabled={disabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${checked ? 'bg-primary dark:bg-accent' : 'bg-outline/80 dark:bg-dark-outline'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? 'right-0.5' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

function SegmentedControl<T extends string>({
  icon,
  title,
  value,
  options,
  disabled = false,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className={sectionItemClassName}>
      <div className="flex items-start gap-3">
        <div className={rowIconClassName}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">{title}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={disabled}
                onClick={() => onChange(option.value)}
                className={`rounded-lg border px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${value === option.value ? 'bg-on-background text-white border-on-background dark:bg-dark-on-background dark:text-dark-background dark:border-dark-on-background' : 'bg-transparent border-outline text-on-surface-variant hover:text-on-surface hover:border-on-surface-variant dark:border-dark-outline dark:text-dark-on-surface-variant dark:hover:text-dark-on-surface dark:hover:border-dark-on-surface-variant'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function NumberControl({
  icon,
  title,
  value,
  min,
  max,
  suffix = '',
  disabled = false,
  onChange,
}: NumberControlProps) {
  return (
    <div className={sectionItemClassName}>
      <div className="flex items-start gap-3">
        <div className={rowIconClassName}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">{title}</p>
            <span className="shrink-0 text-xs font-medium text-on-surface-variant dark:text-dark-on-surface-variant">
              {min}-{max}{suffix}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Input
              type="number"
              min={min}
              max={max}
              step={1}
              value={value}
              disabled={disabled}
              onChange={(event) => onChange(Number(event.target.value))}
              className="min-h-10"
            />
            {suffix ? <span className="shrink-0 text-sm text-on-surface-variant dark:text-dark-on-surface-variant">{suffix}</span> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function saveSetting<K extends keyof Omit<Settings, 'updatedAt'>>(
  mutate: (payload: Partial<Omit<Settings, 'updatedAt'>>) => void,
  key: K,
  value: Settings[K],
) {
  mutate({ [key]: value })
}

function normalizeNumberSetting(value: string, min: number, max: number) {
  if (!value.trim()) {
    return min
  }

  const next = Number(value)

  if (!Number.isFinite(next)) {
    return min
  }

  return Math.max(min, Math.min(max, Math.round(next)))
}

function normalizeWallpaperUrl(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return { value: null, error: null }
  }

  if (trimmed.length > 2048) {
    return { value: null, error: '壁纸地址不能超过 2048 个字符。' }
  }

  try {
    const url = new URL(trimmed)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { value: null, error: '仅支持 http 或 https 图片地址。' }
    }

    return { value: url.toString(), error: null }
  } catch {
    return { value: null, error: '请输入有效的图片 URL。' }
  }
}

export function SettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<SettingsTab>('user')
  const [nameDraft, setNameDraft] = useState('')
  const [wallpaperDraft, setWallpaperDraft] = useState('')
  const [wallpaperError, setWallpaperError] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const { update } = useBootstrapCache()

  const { data, isLoading, isError } = useBootstrapQuery()

  const updateSettings = useMutation({
    mutationFn: api.updateSettings,
    onSuccess: ({ settings }) => {
      update({ settings })
      applyTheme(settings.themeMode)
    },
  })

  const importMutation = useMutation({
    mutationFn: api.importAll,
    onSuccess: (next) => {
      update(next)
      applyTheme(next.settings.themeMode)
      setImportError(null)
    },
    onError: (error) => {
      setImportError(error instanceof Error ? error.message : '导入失败，请稍后重试。')
    },
  })

  const updateUser = useMutation({
    mutationFn: api.updateUser,
    onSuccess: ({ user }) => {
      update((current) => ({ ...current, user }))
    },
  })

  useEffect(() => {
    if (!data) return
    setWallpaperDraft(data.settings.wallpaperUrl ?? '')
    setNameDraft(data.user.displayName ?? '')
  }, [data])

  const handleSaveWallpaper = () => {
    const parsed = normalizeWallpaperUrl(wallpaperDraft)

    if (parsed.error) {
      setWallpaperError(parsed.error)
      return
    }

    setWallpaperError(null)
    updateSettings.mutate({ wallpaperUrl: parsed.value })
  }

  const handleClearWallpaper = () => {
    setWallpaperError(null)
    setWallpaperDraft('')
    updateSettings.mutate({ wallpaperUrl: null })
  }

  const handleWallpaperChange = (value: string) => {
    setWallpaperDraft(value)
    if (wallpaperError) {
      setWallpaperError(null)
    }
  }

  const handleSaveName = () => {
    updateUser.mutate({ displayName: nameDraft.trim() })
  }

  const handleExport = async () => {
    const payload = await api.exportAll()
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = `aeronav-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(href)
  }

  const handleImportFile = async (file: File | null) => {
    if (!file) return

    setImportError(null)

    let parsed: unknown

    try {
      const text = await file.text()
      parsed = JSON.parse(text)
    } catch {
      setImportError('导入文件不是有效的 JSON。')
      return
    }

    const validated = exportPayloadSchema.safeParse(parsed)
    if (!validated.success) {
      setImportError('导入文件格式不正确，请选择系统导出的 JSON 文件。')
      return
    }

    importMutation.mutate(validated.data)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-32 text-sm text-slate-500">正在加载设置...</div>
  }

  if (isError || !data) {
    return <div className="flex items-center justify-center px-4 py-24 text-sm text-red-500">加载配置失败。</div>
  }

  const updateUserError = updateUser.error instanceof ApiError ? updateUser.error.message : null
  const settingsMutationError = updateSettings.error instanceof ApiError ? updateSettings.error.message : null
  const { settings, user } = data
  const displayName = user.displayName || user.name || user.subject || '当前用户'
  const canSaveName = nameDraft.trim() !== (user.displayName ?? '').trim()

  return (
    <PageContainer className="py-6 lg:py-8">
      <div className="space-y-6 lg:space-y-7">
        <header className="border-b border-outline pb-5 dark:border-dark-outline">
          <div className="min-w-0 max-w-3xl">
            <p className="font-headline text-[13px] italic text-on-surface-variant dark:text-dark-on-surface-variant">AeroNav Settings</p>
            <h1 className="mt-1 font-headline text-3xl font-medium tracking-tight text-on-background dark:text-dark-on-background sm:text-[2.5rem]">个性化设置</h1>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant dark:text-dark-on-surface-variant">
              在更克制的界面里统一管理主题、导航行为、天气信息与数据备份。
            </p>
          </div>
        </header>

        <section>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {settingTabs.map((tab) => {
              const isActive = tab.value === activeTab
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`min-w-fit border-b-[2px] px-3.5 py-2.5 text-sm font-medium transition ${isActive ? 'border-primary text-on-background dark:border-accent dark:text-dark-on-background' : 'border-transparent text-on-surface-variant hover:text-on-background dark:text-dark-on-surface-variant dark:hover:text-dark-on-background'}`}
                >
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <div className="space-y-5">
          <SettingSection icon={settingTabs.find((tab) => tab.value === activeTab)?.icon ?? settingTabs[0].icon} title={settingTabs.find((tab) => tab.value === activeTab)?.label ?? settingTabs[0].label}>
              {activeTab === 'user' ? (
                <>
                  <div className="rounded-xl border border-outline bg-surface px-4 py-4 dark:border-dark-outline dark:bg-dark-surface">
                    <div className="flex items-center gap-3">
                      <div className="flex shrink-0 items-center justify-center text-primary dark:text-accent">
                        <span className="material-symbols-outlined text-4xl">account_circle</span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-on-surface dark:text-dark-on-surface">{displayName}</p>
                        <p className="truncate text-sm text-on-surface-variant dark:text-dark-on-surface-variant">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-outline bg-surface px-4 py-4 dark:border-dark-outline dark:bg-dark-surface">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-on-surface-variant dark:text-dark-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">badge</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">显示名称</p>
                        <p className="mt-1 text-xs text-on-surface-variant dark:text-dark-on-surface-variant">仅在 AeroNav 内显示，不会修改登录系统中的姓名。</p>
                        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                          <Input value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} placeholder="请输入显示名称" className="min-h-11 flex-1" />
                          <Button onClick={handleSaveName} disabled={updateUser.isPending || !canSaveName} className="sm:self-start">
                            {updateUser.isPending ? '保存中' : '保存'}
                          </Button>
                        </div>
                        {updateUserError ? <p className="mt-3 text-sm text-red-500">{updateUserError}</p> : null}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-outline bg-surface px-4 py-4 dark:border-dark-outline dark:bg-dark-surface">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-on-surface-variant dark:text-dark-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">password</span>
                        </div>
                        <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">密码</p>
                      </div>
                      <span className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">由登录系统管理</span>
                    </div>
                  </div>
                </>
              ) : null}

              {activeTab === 'appearance' ? (
                <>
                  <SegmentedControl
                    icon="contrast"
                    title="主题模式"
                    value={settings.themeMode}
                    options={[
                      { value: 'light', label: '浅色' },
                      { value: 'dark', label: '深色' },
                      { value: 'system', label: '跟随系统' },
                    ]}
                    onChange={(value) => saveSetting(updateSettings.mutate, 'themeMode', value)}
                  />
                  <SegmentedControl
                    icon="dashboard_customize"
                    title="卡片密度"
                    value={settings.cardDensity}
                    options={[
                      { value: 'comfortable', label: '舒适' },
                      { value: 'compact', label: '紧凑' },
                    ]}
                    onChange={(value) => saveSetting(updateSettings.mutate, 'cardDensity', value)}
                  />
                  <SettingToggleCard
                    icon="apps"
                    title="显示分组图标"
                    checked={settings.showGroupIcons}
                    onToggle={() => saveSetting(updateSettings.mutate, 'showGroupIcons', !settings.showGroupIcons)}
                  />
                  <div className="rounded-xl border border-outline bg-surface px-4 py-4 dark:border-dark-outline dark:bg-dark-surface">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-on-surface-variant dark:text-dark-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">wallpaper</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">全局壁纸</p>
                        <div className="mt-3 space-y-3">
                          <Input
                            type="url"
                            inputMode="url"
                            value={wallpaperDraft}
                            onChange={(event) => handleWallpaperChange(event.target.value)}
                            placeholder="https://example.com/wallpaper.jpg"
                            className="min-h-11"
                          />
                          <div className="flex flex-wrap gap-2">
                            <Button onClick={handleSaveWallpaper} disabled={updateSettings.isPending}>
                              {updateSettings.isPending ? '应用中' : '应用壁纸'}
                            </Button>
                            <Button variant="secondary" onClick={handleClearWallpaper} disabled={updateSettings.isPending && !settings.wallpaperUrl}>
                              清空壁纸
                            </Button>
                          </div>
                          {wallpaperError ? <p className="text-sm text-red-500">{wallpaperError}</p> : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <NumberControl
                    icon="opacity"
                    title="背景遮罩强度"
                    value={settings.wallpaperOverlayOpacity}
                    min={0}
                    max={100}
                    suffix="%"
                    disabled={!settings.wallpaperUrl}
                    onChange={(value) => saveSetting(updateSettings.mutate, 'wallpaperOverlayOpacity', normalizeNumberSetting(String(value), 0, 100))}
                  />
                  <NumberControl
                    icon="blur_on"
                    title="背景模糊"
                    value={settings.wallpaperBlur}
                    min={0}
                    max={100}
                    disabled={!settings.wallpaperUrl}
                    onChange={(value) => saveSetting(updateSettings.mutate, 'wallpaperBlur', normalizeNumberSetting(String(value), 0, 100))}
                  />
                </>
              ) : null}

              {activeTab === 'navigation' ? (
                <>
                  <SettingToggleCard
                    icon="open_in_new"
                    title="默认在新标签页打开"
                    checked={settings.openInNewTab}
                    onToggle={() => saveSetting(updateSettings.mutate, 'openInNewTab', !settings.openInNewTab)}
                  />
                  <SegmentedControl
                    icon="manage_search"
                    title="默认搜索引擎"
                    value={settings.searchEngine}
                    options={[
                      { value: 'bing', label: '必应' },
                      { value: 'google', label: '谷歌' },
                    ]}
                    onChange={(value) => saveSetting(updateSettings.mutate, 'searchEngine', value)}
                  />
                </>
              ) : null}

              {activeTab === 'weather' ? (
                <>
                  <SettingToggleCard
                    icon="cloud"
                    title="显示天气组件"
                    checked={settings.weatherEnabled}
                    onToggle={() => saveSetting(updateSettings.mutate, 'weatherEnabled', !settings.weatherEnabled)}
                  />
                  <SettingToggleCard
                    icon="my_location"
                    title="自动定位天气位置"
                    checked={settings.weatherAutoLocate}
                    disabled={!settings.weatherEnabled}
                    onToggle={() => saveSetting(updateSettings.mutate, 'weatherAutoLocate', !settings.weatherAutoLocate)}
                  />
                  <SegmentedControl
                    icon="device_thermostat"
                    title="温度单位"
                    value={settings.temperatureUnit}
                    disabled={!settings.weatherEnabled}
                    options={[
                      { value: 'system', label: '自动' },
                      { value: 'c', label: '°C' },
                      { value: 'f', label: '°F' },
                    ]}
                    onChange={(value) => saveSetting(updateSettings.mutate, 'temperatureUnit', value)}
                  />
                </>
              ) : null}

              {activeTab === 'data' ? (
                <>
                  <div className="rounded-xl border border-outline bg-surface px-4 py-4 dark:border-dark-outline dark:bg-dark-surface">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-on-surface-variant dark:text-dark-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">导出配置</p>
                        </div>
                      </div>
                      <Button onClick={handleExport}>导出</Button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-outline bg-surface px-4 py-4 dark:border-dark-outline dark:bg-dark-surface">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-on-surface-variant dark:text-dark-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">upload</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">恢复备份</p>
                        </div>
                      </div>
                      <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={importMutation.isPending}>
                        {importMutation.isPending ? '导入中' : '导入'}
                      </Button>
                    </div>
                    <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(event) => handleImportFile(event.target.files?.[0] ?? null)} />
                    {importError ? <p className="mt-3 text-sm text-red-500">{importError}</p> : null}
                  </div>
                </>
              ) : null}
            </SettingSection>

            {settingsMutationError ? <p className="text-sm text-red-500">{settingsMutationError}</p> : null}
          </div>
      </div>
    </PageContainer>
  )
}
