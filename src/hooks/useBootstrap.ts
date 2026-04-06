import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { api, type BootstrapData } from '../lib/api'

export const bootstrapQueryKey = ['bootstrap'] as const

export function useBootstrapQuery() {
  return useQuery({ queryKey: bootstrapQueryKey, queryFn: api.bootstrap })
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
