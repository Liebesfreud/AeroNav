import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(1),
  name: z.string().nullable(),
})

export const groupSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  icon: z.string().nullable(),
  sortOrder: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const linkSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  title: z.string().min(1),
  url: z.string().url(),
  icon: z.string().nullable(),
  description: z.string().nullable(),
  sortOrder: z.number().int(),
  pinned: z.boolean(),
  archived: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const settingsSchema = z.object({
  themeMode: z.enum(['light', 'dark', 'system']),
  cardDensity: z.enum(['compact', 'comfortable']),
  openInNewTab: z.boolean(),
  showGroupIcons: z.boolean(),
  updatedAt: z.string(),
})

export const bootstrapSchema = z.object({
  user: userSchema,
  groups: z.array(groupSchema),
  links: z.array(linkSchema),
  settings: settingsSchema,
})

export type User = z.infer<typeof userSchema>
export type Group = z.infer<typeof groupSchema>
export type LinkItem = z.infer<typeof linkSchema>
export type Settings = z.infer<typeof settingsSchema>
export type BootstrapData = z.infer<typeof bootstrapSchema>

export type ApiSuccess<T> = {
  ok: true
  data: T
  error: null
}

export type ApiFailure = {
  ok: false
  data: null
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  const json = (await response.json()) as ApiResponse<T>

  if (!json.ok) {
    throw new Error(json.error.message)
  }

  return json.data
}

export const api = {
  bootstrap: () => request<BootstrapData>('/api/bootstrap'),
  createGroup: (payload: { name: string; icon?: string | null }) =>
    request<{ group: Group; groups: Group[] }>('/api/groups', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateGroup: (id: string, payload: Partial<{ name: string; icon: string | null; sortOrder: number }>) =>
    request<{ group: Group; groups: Group[] }>(`/api/groups/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  deleteGroup: (id: string) =>
    request<{ groups: Group[]; links: LinkItem[] }>(`/api/groups/${id}`, { method: 'DELETE' }),
  createLink: (payload: Partial<LinkItem> & { title: string; url: string; groupId: string }) =>
    request<{ link: LinkItem; links: LinkItem[] }>('/api/links', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateLink: (id: string, payload: Partial<LinkItem>) =>
    request<{ link: LinkItem; links: LinkItem[] }>(`/api/links/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  deleteLink: (id: string) =>
    request<{ links: LinkItem[] }>(`/api/links/${id}`, { method: 'DELETE' }),
  reorder: (payload: { groups: Array<{ id: string; sortOrder: number }>; links: Array<{ id: string; groupId: string; sortOrder: number }> }) =>
    request<{ groups: Group[]; links: LinkItem[] }>('/api/reorder', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateSettings: (payload: Partial<Settings>) =>
    request<{ settings: Settings }>('/api/import?settings=1', {
      method: 'POST',
      body: JSON.stringify({ settingsOnly: true, settings: payload }),
    }),
  exportAll: () => request<{ version: string; exportedAt: string; groups: Group[]; links: LinkItem[]; settings: Settings }>('/api/export'),
  importAll: (payload: unknown) =>
    request<BootstrapData>('/api/import', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
