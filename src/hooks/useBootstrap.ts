import { useRef } from 'react'
import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { api, type BootstrapData } from '../lib/api'

export const bootstrapQueryKey = ['bootstrap'] as const

export function useBootstrapQuery() {
  const queryClient = useQueryClient()
  const versionRef = useRef<string | null>(null)

  return useQuery({
    queryKey: bootstrapQueryKey,
    queryFn: async () => {
      const result = await api.bootstrapIncremental(versionRef.current)

      if (result.version) {
        versionRef.current = result.version
      }

      if (result.status === 'not-modified') {
        const current = queryClient.getQueryData<BootstrapData>(bootstrapQueryKey)
        if (current) return current
        return api.bootstrap()
      }

      return result.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    refetchOnMount: false,
  })
}

export function updateBootstrapCache(
  queryClient: QueryClient,
  updater: Partial<BootstrapData> | ((current: BootstrapData) => BootstrapData),
) {
  queryClient.setQueryData<BootstrapData>(bootstrapQueryKey, (current) => {
    if (!current) return current
    return typeof updater === 'function' ? updater(current) : { ...current, ...updater }
  })
}

export function replaceBootstrapCache(queryClient: QueryClient, next: BootstrapData) {
  queryClient.setQueryData<BootstrapData>(bootstrapQueryKey, next)
}

export function useBootstrapCache() {
  const queryClient = useQueryClient()

  return {
    update: (updater: Partial<BootstrapData> | ((current: BootstrapData) => BootstrapData)) =>
      updateBootstrapCache(queryClient, updater),
    replace: (next: BootstrapData) => replaceBootstrapCache(queryClient, next),
  }
}
