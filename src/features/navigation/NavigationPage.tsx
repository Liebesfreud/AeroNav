import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Drawer } from '../../components/Drawer'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { api, type BootstrapData, type LinkItem } from '../../lib/api'

type LinkDraft = { title: string; url: string; icon: string; description: string; groupId: string; pinned: boolean; archived: boolean }
const emptyLinkDraft: LinkDraft = { title: '', url: '', icon: '', description: '', groupId: '', pinned: false, archived: false }

function renderIconFallback(title: string, colorClass: string) {
  return (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-sm ${colorClass}`}>
      {title.charAt(0).toUpperCase()}
    </div>
  )
}

function getBrandColor(url: string | undefined, index: number) {
  const str = (url || '').toLowerCase()
  if (str.includes('youtube')) return 'bg-red-500'
  if (str.includes('twitter') || str.includes('x.com')) return 'bg-sky-500'
  if (str.includes('discord')) return 'bg-indigo-500'
  if (str.includes('github')) return 'bg-slate-800'
  if (str.includes('tiktok')) return 'bg-black'
  if (str.includes('figma')) return 'bg-purple-500'
  if (str.includes('spotify')) return 'bg-emerald-500'
  if (str.includes('mail')) return 'bg-orange-500'
  if (str.includes('music')) return 'bg-emerald-500'
  
  const colors = [
    'bg-[#3b82f6]', 'bg-[#10b981]', 'bg-[#f59e0b]', 'bg-[#ef4444]', 
    'bg-[#8b5cf6]', 'bg-[#ec4899]', 'bg-[#06b6d4]', 'bg-[#f43f5e]'
  ]
  return colors[index % colors.length]
}

export function NavigationPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [linkDrawerOpen, setLinkDrawerOpen] = useState(false)
  const [deleteState, setDeleteState] = useState<{ type: 'group' | 'link'; id: string; title: string } | null>(null)
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null)
  const [linkDraft, setLinkDraft] = useState<LinkDraft>(emptyLinkDraft)
  const searchRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useQuery({ queryKey: ['bootstrap'], queryFn: api.bootstrap })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && document.activeElement !== searchRef.current) {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const groups = data?.groups ?? []
  const links = data?.links ?? []

  const filteredLinks = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return links.filter((link) => !link.archived)
    return links.filter((link) => [link.title, link.url, link.description ?? ''].some((value) => value.toLowerCase().includes(q)))
  }, [links, search])

  const syncBootstrap = (next: Partial<BootstrapData>) => {
    queryClient.setQueryData<BootstrapData>(['bootstrap'], (current) => (current ? { ...current, ...next } : current))
  }

  const createLinkMutation = useMutation({
    mutationFn: api.createLink,
    onSuccess: ({ links: nextLinks }) => {
      syncBootstrap({ links: nextLinks }); setLinkDrawerOpen(false); setLinkDraft(emptyLinkDraft)
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: async (state: NonNullable<typeof deleteState>) => state.type === 'group' ? api.deleteGroup(state.id) : api.deleteLink(state.id),
    onSuccess: (payload, state) => {
      syncBootstrap(state.type === 'group' ? payload : { links: payload.links })
      setDeleteState(null)
    },
  })

  const openCreateLink = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setEditingLink(null)
    setLinkDraft({ ...emptyLinkDraft, groupId: groups[0]?.id ?? '' })
    setLinkDrawerOpen(true)
  }

  const submitLink = () => {
    if (!linkDraft.title.trim() || !linkDraft.url.trim()) return
    createLinkMutation.mutate({
      title: linkDraft.title.trim(),
      url: linkDraft.url.trim(),
      icon: linkDraft.icon.trim() || null,
      description: linkDraft.description.trim() || null,
      groupId: linkDraft.groupId || groups[0]?.id,
      pinned: linkDraft.pinned,
      archived: linkDraft.archived,
    })
  }

  if (isLoading) return <div className="flex h-full w-full items-center justify-center text-on-surface-variant font-label text-xl tracking-widest mt-32">Loading ETHOS...</div>

  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pt-8 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8 lg:pt-10">
        <div className="flex flex-col">
          <h1 className="font-headline text-5xl font-extralight leading-none tracking-tighter text-[#212121] sm:text-6xl lg:text-[5rem]">14:42</h1>
          <p className="mt-3 font-label text-xs font-medium uppercase tracking-[0.18em] text-[#212121]/50 sm:text-sm">Monday, October 24</p>
        </div>
        <div className="flex items-center gap-4 py-2">
          <span className="material-symbols-outlined text-2xl text-[#212121]/30 sm:text-3xl">cloud_queue</span>
          <div className="flex flex-col">
            <span className="font-headline text-2xl font-light text-[#212121] sm:text-3xl">18°C</span>
            <span className="font-label text-[11px] uppercase tracking-widest text-[#212121]/40 sm:text-xs">London / Clear Sky</span>
          </div>
        </div>
      </section>

      <section className="mb-16 flex w-full flex-col items-center justify-center px-4 sm:px-6 lg:mb-20 lg:px-8">
        <div className="relative w-full max-w-3xl">
          <div className="flex items-center rounded-[2rem] border border-black/5 bg-white p-1.5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#99462a]/10">
            <div className="hidden items-center gap-2 border-r border-black/5 pl-5 pr-4 sm:flex">
              <span className="material-symbols-outlined text-xl text-[#212121]/40">search</span>
              <select className="appearance-none bg-transparent p-0 pr-2 font-label text-xs font-semibold uppercase tracking-wider text-[#212121]/60 outline-none focus:ring-0">
                <option>Google</option>
                <option>DuckDuckGo</option>
                <option>Bing</option>
              </select>
            </div>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border-none bg-transparent px-5 py-3 text-base font-body text-[#212121] outline-none placeholder:text-[#212121]/30 focus:ring-0 sm:px-6"
              placeholder="Search the ethereal..."
              type="text"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-28">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredLinks.map((link, i) => {
            const isFeatured = i === 0

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={`group relative flex overflow-hidden rounded-xl border border-black/[0.02] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isFeatured ? 'min-h-[18rem] flex-col justify-between p-8 sm:col-span-2 xl:col-span-2' : 'min-h-[12rem] flex-col gap-6 p-6'}`}
              >
                <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={(e) => { e.preventDefault(); setDeleteState({ type: 'link', id: link.id, title: link.title }) }} className="flex h-8 w-8 items-center justify-center rounded bg-slate-100/60 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500" aria-label={`Delete ${link.title}`}>
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
                <div className="flex items-start justify-between gap-4">
                  {link.icon ? (
                    <div className={`${isFeatured ? 'h-14 w-14 rounded-xl' : 'h-10 w-10 rounded-lg'} flex items-center justify-center text-white ${getBrandColor(link.url, i)}`}>
                      <span className={`material-symbols-outlined font-bold ${isFeatured ? 'text-3xl' : 'text-lg'}`}>{link.icon}</span>
                    </div>
                  ) : (
                    renderIconFallback(link.title, getBrandColor(link.url, i))
                  )}
                  <span className="material-symbols-outlined text-black/10 transition-colors group-hover:text-[#99462a]">north_east</span>
                </div>
                <div className={isFeatured ? 'mt-8' : 'mt-auto'}>
                  <h3 className={`font-headline font-bold tracking-tight text-[#212121] ${isFeatured ? 'text-xl' : 'text-base'}`}>{link.title}</h3>
                  <p className={`mt-2 font-body text-[#212121]/50 ${isFeatured ? 'text-sm leading-relaxed' : 'line-clamp-2 text-sm'}`}>
                    {link.description || 'Explore this link.'}
                  </p>
                </div>
              </a>
            )
          })}

          <button onClick={openCreateLink} className="group flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-black/5 bg-transparent p-6 transition-all duration-300 hover:border-[#99462a]/30 hover:bg-[#99462a]/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99462a]/20">
            <span className="material-symbols-outlined text-2xl text-black/20 group-hover:text-[#99462a] transition-colors">add</span>
            <span className="font-label text-xs font-bold text-black/30 group-hover:text-[#99462a] uppercase tracking-wider transition-colors">Add Site</span>
          </button>
        </div>
      </section>

      <Drawer open={linkDrawerOpen} onOpenChange={setLinkDrawerOpen} title={editingLink ? '编辑链接' : '新建链接'}>
        <div className="space-y-3 p-1">
          <Input value={linkDraft.title} onChange={(e) => setLinkDraft(d => ({ ...d, title: e.target.value }))} placeholder="标题" />
          <Input value={linkDraft.url} onChange={(e) => setLinkDraft(d => ({ ...d, url: e.target.value }))} placeholder="https://example.com" />
          <Input value={linkDraft.icon} onChange={(e) => setLinkDraft(d => ({ ...d, icon: e.target.value }))} placeholder="图标首字母或者Material Design字母 (如: mail)" />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setLinkDrawerOpen(false)}>取消</Button>
            <Button onClick={submitLink}>{editingLink ? '保存' : '创建'}</Button>
          </div>
        </div>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteState)}
        onOpenChange={(open) => { if (!open) setDeleteState(null) }}
        title={deleteState?.type === 'group' ? '删除分组' : '删除应用'}
        description={`确认删除「${deleteState?.title ?? ''}」吗？`}
        actions={
          <>
            <Button variant="secondary" onClick={() => setDeleteState(null)}>取消</Button>
            <Button variant="danger" onClick={() => deleteState && deleteMutation.mutate(deleteState)}>删除</Button>
          </>
        }
      />
      
      <div className="fixed bottom-10 right-12 flex flex-col items-end gap-1 opacity-20 hover:opacity-100 transition-opacity z-10 pointer-events-none">
        <p className="font-label text-[9px] tracking-widest text-[#212121] uppercase font-bold">ETHOS Core v2.4.0</p>
      </div>
    </>
  )
}
