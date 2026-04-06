import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Layout } from '../components/layout/Layout'
import { api } from '../lib/api'
import { applyTheme } from '../lib/theme'

export function App() {
  const { data } = useQuery({ queryKey: ['bootstrap'], queryFn: api.bootstrap })

  useEffect(() => {
    if (data) applyTheme(data.settings.themeMode)
  }, [data])

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

