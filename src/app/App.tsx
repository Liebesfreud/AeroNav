import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Layout } from '../components/layout/Layout'
import { useBootstrapCache, useBootstrapQuery } from '../hooks/useBootstrap'
import { api, type BootstrapData } from '../lib/api'
import { applyTheme, resolveTheme } from '../lib/theme'

export type AppOutletContext = {
  editMode: boolean
  bootstrapData: BootstrapData | undefined
  bootstrapLoading: boolean
  bootstrapRefreshing: boolean
  bootstrapError: boolean
}

export function App() {
  const { data, isLoading, isFetching, isError } = useBootstrapQuery()
  const { update } = useBootstrapCache()
  const [editMode, setEditMode] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false)

  useEffect(() => {
    if (data) applyTheme(data.settings.themeMode)
  }, [data])

  const updateSettingsMutation = useMutation({
    mutationFn: api.updateSettings,
    onSuccess: ({ settings }) => {
      update({ settings })
      applyTheme(settings.themeMode)
    },
  })

  const handleToggleTheme = () => {
    if (!data) return
    const nextTheme = resolveTheme(data.settings.themeMode) === 'dark' ? 'light' : 'dark'
    updateSettingsMutation.mutate({ themeMode: nextTheme })
  }

  return (
    <Layout
      themeMode={data?.settings.themeMode}
      wallpaperUrl={data?.settings.wallpaperUrl}
      wallpaperOverlayOpacity={data?.settings.wallpaperOverlayOpacity}
      wallpaperBlur={data?.settings.wallpaperBlur}
      onToggleTheme={handleToggleTheme}
      editMode={editMode}
      onToggleEditMode={() => setEditMode((current) => !current)}
      sidebarVisible={sidebarVisible}
      onToggleSidebar={() => setSidebarVisible((current) => !current)}
      bootstrapLoading={isLoading && !data}
      bootstrapRefreshing={isFetching && !!data}
      bootstrapError={isError && !data}
    >
      <Outlet context={{
        editMode,
        bootstrapData: data,
        bootstrapLoading: isLoading && !data,
        bootstrapRefreshing: isFetching && !!data,
        bootstrapError: isError && !data,
      }} />
    </Layout>
  )
}

