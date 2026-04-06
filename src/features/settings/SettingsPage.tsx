import { useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { applyTheme } from '../../lib/theme'

export function SettingsPage() {
  const queryClient = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)
  
  const { data, isLoading, isError } = useQuery({ queryKey: ['bootstrap'], queryFn: api.bootstrap })

  const updateSettings = useMutation({
    mutationFn: api.updateSettings,
    onSuccess: ({ settings }) => {
      queryClient.setQueryData(['bootstrap'], (current: any) => current ? { ...current, settings } : current)
      applyTheme(settings.themeMode)
    },
  })

  const importMutation = useMutation({
    mutationFn: api.importAll,
    onSuccess: (next) => {
      queryClient.setQueryData(['bootstrap'], next)
      applyTheme(next.settings.themeMode)
    },
  })

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
    const text = await file.text()
    importMutation.mutate(JSON.parse(text))
  }

  if (isLoading) {
    return <div className="text-sm text-slate-500 flex justify-center items-center py-32">Loading settings...</div>
  }
  if (isError || !data) {
    return <div className="flex items-center justify-center px-4 py-24 text-sm text-red-500">Failed to load configuration.</div>
  }

  const { settings, user } = data

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="mb-10">
        <h1 className="text-5xl font-headline font-bold tracking-tight text-on-background mb-3">Digital Sanctuary</h1>
        <p className="text-on-surface-variant font-body text-lg max-w-2xl">Refine your workspace to enhance clarity and focus. Every detail is designed for your peace of mind.</p>
      </header>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="flex flex-col gap-8 xl:col-span-8">
          {/* Theme & Style */}
          <section className="card-panel p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary">palette</span>
              <h2 className="text-xl font-headline font-bold">Theme & Style</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-4">Appearance</p>
                <div className="flex p-1 bg-surface-container rounded-lg max-w-fit">
                  {(['light', 'dark', 'system'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => updateSettings.mutate({ themeMode: mode })}
                      className={`px-6 py-2 rounded-md text-sm transition-all capitalize ${settings.themeMode === mode ? 'font-semibold bg-white text-on-surface shadow-sm' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-4">Density</p>
                <div className="flex p-1 bg-surface-container rounded-lg max-w-fit">
                  {(['comfortable', 'compact'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => updateSettings.mutate({ cardDensity: mode })}
                      className={`px-6 py-2 rounded-md text-sm transition-all capitalize ${settings.cardDensity === mode ? 'font-semibold bg-white text-on-surface shadow-sm' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Interface Toggles */}
          <section className="card-panel p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary">grid_view</span>
              <h2 className="text-xl font-headline font-bold">Interface Overrides</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline/50">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">open_in_new</span>
                  <span className="text-sm font-medium">Open in new tab</span>
                </div>
                <button 
                  onClick={() => updateSettings.mutate({ openInNewTab: !settings.openInNewTab })}
                  className={`w-10 h-5 rounded-full relative transition-colors ${settings.openInNewTab ? 'bg-primary' : 'bg-outline'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings.openInNewTab ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline/50">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">folder</span>
                  <span className="text-sm font-medium">Show group icons</span>
                </div>
                <button 
                  onClick={() => updateSettings.mutate({ showGroupIcons: !settings.showGroupIcons })}
                  className={`w-10 h-5 rounded-full relative transition-colors ${settings.showGroupIcons ? 'bg-primary' : 'bg-outline'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings.showGroupIcons ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right side Profile & Data */}
        <div className="flex flex-col gap-8 xl:col-span-4">
          <section className="card-panel flex flex-col items-center rounded-xl p-6 pt-8 text-center xl:sticky xl:top-28">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-4 ring-4 ring-white shadow-sm text-primary">
               <span className="material-symbols-outlined text-4xl">face</span>
            </div>
            <h3 className="text-lg font-headline font-bold text-on-surface mt-2">{user.subject || 'Admin'}</h3>
            <p className="text-xs text-on-surface-variant mb-6">{user.email}</p>
            <button className="w-full py-2 bg-surface-container hover:bg-outline/50 text-on-surface font-bold rounded-lg text-xs transition-colors mb-2">
              Manage Account
            </button>
            <button className="w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-lg text-xs transition-colors">
              Sign Out
            </button>
          </section>

          <section className="card-panel p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">dns</span>
              <h2 className="text-xl font-headline font-bold">Data Management</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Export/Import</label>
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline/30">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">backup</span>
                    <span className="text-xs font-bold">Backup JSON</span>
                  </div>
                  <button onClick={handleExport} className="text-xs font-bold font-label text-primary hover:opacity-70 transition-opacity uppercase">Export</button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline/30">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">restore</span>
                    <span className="text-xs font-bold">Restore Setup</span>
                  </div>
                  <button onClick={() => fileRef.current?.click()} className="text-xs font-bold font-label text-primary hover:opacity-70 transition-opacity uppercase">Import</button>
                  <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(event) => handleImportFile(event.target.files?.[0] ?? null)} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
