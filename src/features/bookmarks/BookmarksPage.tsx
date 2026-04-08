import type { ReactNode } from 'react'
import { AppIcon } from '../../components/AppIcon'
import { Button } from '../../components/Button'
import { PageContainer } from '../../components/layout/PageContainer'


type BookmarkCardProps = {
  icon: string
  title: string
  description: string
  domain: string
}

type BookmarkRowProps = {
  icon: string
  title: string
  detail: string
}

type BookmarkMediaCardProps = {
  title: string
  description: string
  domain: string
  imageUrl: string
}

type BookmarkShortcutProps = {
  icon: string
  title: string
  category: string
}

const designTools: BookmarkCardProps[] = [
  {
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ7fJo-unr1tzwhbAlzQhhPmZzsbzdtnS_CVzi7zV4HU9dOEeTVha2AUaLyEib2dHyJ01xmiZRaOYymbYpp_apU0pRwhbXqv7tE6Y_s8yFHLrzmsx4-1OSRAq6fLpmNgGU5od9L9QTgUpFTT6sB96o8Av8apZNLvWclgW5mltqTD58pD0tT0PIYU6ve7VtiSVaEXa3UkUeAy1CJnK52bimXwQ0uSLOweAbYC8uslS23CKNFBSSxijp7HpUEOWloTxJX5asGflsHIo',
    title: 'Figma Dashboard',
    description: 'Collaborative interface design tool for teams and designers.',
    domain: 'FIGMA.COM',
  },
  {
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClKK2A2wOfty9bwT7R4Xz-rm39Hx2LFaSNgeZP29kJAbjqkEMtit_Sjw3o6GUm01jrKtnv-M9wBzOWZa9iNpE9kPkw-kOd43JykVpPiSKyMrZYp_4mYkn7i9aYH4b4GmLZ5mS5zfeBnt8Fc7kHLJTpIvZFuML7X77JX328YYXQUE33RzGMf48TfwpkvAr0B2gGwNxxD9syvkH9pwvJPM_-rZJWsCYM-WM7giQPUJK7235tkxQL2Qn08CKKOXVl0Fc65yNFxo-eWuE',
    title: 'Framer Sites',
    description: 'Next-generation site builder for production-ready design.',
    domain: 'FRAMER.COM',
  },
]

const workBookmarks: BookmarkRowProps[] = [
  { icon: 'mail', title: 'Gmail Inbox', detail: '24 unread messages' },
  { icon: 'terminal', title: 'GitHub Repos', detail: 'Updated 2h ago' },
  { icon: 'calendar_today', title: 'Calendar', detail: '3 upcoming meetings' },
]

const learningBookmarks: BookmarkMediaCardProps[] = [
  {
    title: 'MDN Web Docs',
    description: 'Web developer resources.',
    domain: 'DEVELOPER.MOZILLA.ORG',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-N5N0UhbfC8QEN0OIdvqaxpkC3Nolx7oX060zS2viphIGQ2OfqKZwrQnWIKkjjfKyTswE-_jnojhzmpgFGpRuHjJKRguwt-n6y2E3ZJs5shBB2hApb3jka2WrJNKXfVIpW7Ih8I27cQdTY-M7BIs6QTft17s7FYYoC_3RYutDNlCC-1aC1hnnf2m6i81Slb3tssrHOA_B91ZqfXpqaOZyncqMpb3gOUaeQoUPDUlv23S_YS7EPkF1fqPlKfd99fAECiiVjSFYQP0',
  },
  {
    title: 'Frontend Masters',
    description: 'Deep dive video courses.',
    domain: 'FRONTENDMASTERS.COM',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2nXJU09ViY9gKpc3ukA5UfHCvyclNDiGe33aBw_CCuhZv2vRi6H3NL0gdDQ_6BozIYx7s9Wb2VHvNpDTXWxSITlcytGpR_EIGjsbZxhcCyHjeK50G2EJuQ2bvEgJASW6YmPkvx55lpQ95qh8tSWpTTjDK48g2aGXhn3xhSfPBzVo84OgpK4qUYy8f9o9BFojBRrbbmOOU7b4-DSP4h7dKixwDv_LaDLi6dBZ6gXtPPXP3YuNp1tzgchljHrGXFfuno73NPNvina4',
  },
  {
    title: 'The CSS Podcast',
    description: 'Modern CSS design tips.',
    domain: 'PODCASTS.GOOGLE.COM',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOYhHfb1fdZ_84kmYK2tj9Iui4YHf02kyXGc-HY6QeRxNGaZoCdZPU_y12XjdBIE1zcIYblAdbJZeD0xqPUGM1wmt7IsOhiQ-Mkw1N1VbhLvJ44ZGLs5DxjSdYwOZBg6uPw1eels0AUqtANsrUSW9DZrU6eoC1UTy_J4gVuIDcXM-c-CNXnWkhwnXzhtr9boILo4SALRJjjYaeZdRhSUs-qLxqYseO55dptEugcgNx39zeXeS8bvLrcPPVEuNpjkopJ9gIeGe2QaY',
  },
]

const entertainmentBookmarks: BookmarkShortcutProps[] = [
  { icon: 'play_arrow', title: 'YouTube', category: 'Video' },
  { icon: 'music_note', title: 'Spotify', category: 'Music' },
  { icon: 'forum', title: 'Reddit', category: 'Social' },
  { icon: 'movie', title: 'Netflix', category: 'Streaming' },
]

function SectionHeading({
  icon,
  title,
  meta,
  action,
}: {
  icon: string
  title: string
  meta?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-outline/50 pb-4 dark:border-dark-outline/60">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary dark:bg-dark-surface-container/70 dark:text-accent">
          <AppIcon name={icon} className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-headline text-2xl font-semibold tracking-tight text-on-background dark:text-dark-on-background">{title}</h2>
          {meta ? <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant dark:text-dark-on-surface-variant">{meta}</p> : null}
        </div>
      </div>
      {action}
    </div>
  )
}

function BookmarkCard({ icon, title, description, domain }: BookmarkCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-outline/45 bg-surface/68 p-5 transition hover:bg-surface/92 dark:border-dark-outline/55 dark:bg-dark-surface-elevated/72">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container dark:bg-dark-surface-container">
          <img alt={title} className="h-8 w-8 object-contain grayscale transition-all group-hover:grayscale-0" src={icon} />
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-xl text-on-surface-variant transition hover:bg-surface-container-low hover:text-primary dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container/80 dark:hover:text-accent">
          <AppIcon name="edit_note" className="h-[18px] w-[18px]" />
        </button>
      </div>
      <h3 className="text-lg font-semibold text-on-surface transition-colors group-hover:text-primary dark:text-dark-on-surface dark:group-hover:text-accent">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-on-surface-variant dark:text-dark-on-surface-variant">{description}</p>
      <p className="mt-6 text-[11px] font-semibold tracking-[0.16em] text-on-surface-variant/80 dark:text-dark-on-surface-variant/80">{domain}</p>
      <a className="absolute inset-0 rounded-xl" href="#" aria-label={title}></a>
    </div>
  )
}

function BookmarkRow({ icon, title, detail }: BookmarkRowProps) {
  return (
    <div className="group relative flex items-center gap-4 rounded-xl border border-transparent px-4 py-4 transition hover:bg-surface-container-low/80 dark:hover:bg-dark-surface-container/55">
      <a className="absolute inset-0 rounded-xl" href="#" aria-label={title}></a>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary dark:bg-dark-surface-container/70 dark:text-accent">
        <AppIcon name={icon} className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">{title}</p>
        <p className="mt-1 text-xs text-on-surface-variant dark:text-dark-on-surface-variant">{detail}</p>
      </div>
      <AppIcon name="north_east" className="h-4 w-4 text-on-surface-variant transition-colors group-hover:text-primary dark:text-dark-on-surface-variant dark:group-hover:text-accent" />
    </div>
  )
}

function BookmarkMediaCard({ title, description, domain, imageUrl }: BookmarkMediaCardProps) {
  return (
    <div className="group relative min-w-[320px] overflow-hidden rounded-xl border border-outline/45 bg-surface/68 dark:border-dark-outline/55 dark:bg-dark-surface-elevated/72">
      <a className="absolute inset-0 z-10 rounded-xl" href="#" aria-label={title}></a>
      <div className="relative h-40 overflow-hidden bg-surface-container dark:bg-dark-surface-container">
        <img className="h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100" src={imageUrl} alt="" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent dark:from-dark-surface-elevated/90"></div>
      </div>
      <div className="p-6">
        <h3 className="text-base font-semibold text-on-surface transition-colors group-hover:text-primary dark:text-dark-on-surface dark:group-hover:text-accent">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant dark:text-dark-on-surface-variant">{description}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-[0.16em] text-on-surface-variant/80 dark:text-dark-on-surface-variant/80">{domain}</span>
          <AppIcon name="arrow_forward" className="h-4 w-4 text-on-surface-variant transition-colors group-hover:text-primary dark:text-dark-on-surface-variant dark:group-hover:text-accent" />
        </div>
      </div>
    </div>
  )
}

function BookmarkShortcut({ icon, title, category }: BookmarkShortcutProps) {
  return (
    <a href="#" className="group flex items-center gap-4 rounded-xl border border-outline/45 bg-surface/68 p-4 transition hover:bg-surface/92 dark:border-dark-outline/55 dark:bg-dark-surface-elevated/72">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-low text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-dark-surface-container/70 dark:text-accent dark:group-hover:bg-accent dark:group-hover:text-slate-950">
        <AppIcon name={icon} className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">{title}</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant dark:text-dark-on-surface-variant">{category}</p>
      </div>
    </a>
  )
}

export function BookmarksPage() {
  return (
    <PageContainer>
      <div className="space-y-8 pb-24">
        <header className="border-b border-outline/50 pb-6 dark:border-dark-outline/60">
          <p className="font-label text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant dark:text-dark-on-surface-variant">AeroNav 收藏</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-headline text-3xl font-semibold tracking-tight text-on-background dark:text-dark-on-background sm:text-[2.5rem]">收藏与灵感</h1>
              <p className="mt-3 text-sm leading-7 text-on-surface-variant dark:text-dark-on-surface-variant sm:text-base">
                将常用资源、学习内容和娱乐入口整理成清晰分区，而不是一页拼贴式模板。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary">
                <AppIcon name="folder_open" className="mr-2 inline h-[18px] w-[18px] align-[-4px]" />
                整理分组
              </Button>
              <Button>
                <AppIcon name="add" className="mr-2 inline h-[18px] w-[18px] align-[-4px]" />
                新建收藏
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
          <section className="space-y-6">
            <SectionHeading icon="draw" title="设计工具" meta="4 项" />
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {designTools.map((bookmark) => (
                <BookmarkCard key={bookmark.title} {...bookmark} />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading icon="work" title="工作" meta="3 项" />
            <div className="mt-6 space-y-2 rounded-xl bg-surface-container-low/70 p-2 dark:bg-dark-surface-container/55">
              {workBookmarks.map((bookmark) => (
                <BookmarkRow key={bookmark.title} {...bookmark} />
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-on-background px-6 py-7 text-white dark:bg-dark-surface dark:text-dark-on-background">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50 dark:text-dark-on-surface-variant">收藏总览</p>
              <p className="mt-4 font-headline text-5xl font-semibold">142</p>
              <p className="mt-3 text-sm leading-7 text-white/70 dark:text-dark-on-surface-variant">已整理为 8 个分区，本周新增内容较上周提升 12%。</p>
            </div>
          </section>
        </div>

        <section className="space-y-6 border-t border-outline/40 pt-6 dark:border-dark-outline/50">
          <SectionHeading
            icon="school"
            title="学习与研究"
            action={
              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-outline/70 bg-surface-container-low text-on-surface-variant transition hover:bg-surface-container hover:text-on-surface dark:border-dark-outline/70 dark:bg-dark-surface-container/60 dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container dark:hover:text-dark-on-surface">
                  <AppIcon name="chevron_left" className="h-4 w-4" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-outline/70 bg-surface-container-low text-on-surface-variant transition hover:bg-surface-container hover:text-on-surface dark:border-dark-outline/70 dark:bg-dark-surface-container/60 dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container dark:hover:text-dark-on-surface">
                  <AppIcon name="chevron_right" className="h-4 w-4" />
                </button>
              </div>
            }
          />
          <div className="mt-6 flex gap-6 overflow-x-auto pb-2">
            {learningBookmarks.map((bookmark) => (
              <BookmarkMediaCard key={bookmark.title} {...bookmark} />
            ))}
          </div>
        </section>

        <section className="space-y-6 border-t border-outline/40 pt-6 dark:border-dark-outline/50">
          <SectionHeading
            icon="theaters"
            title="娱乐"
            action={<button className="text-sm font-semibold text-primary transition hover:opacity-70 dark:text-accent">浏览分类</button>}
          />
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {entertainmentBookmarks.map((bookmark) => (
              <BookmarkShortcut key={bookmark.title} {...bookmark} />
            ))}
          </div>
        </section>

        <button className="fixed bottom-10 right-10 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-on-background text-white shadow-xl transition hover:scale-105 hover:bg-primary dark:bg-dark-surface dark:text-dark-on-background dark:hover:bg-accent dark:hover:text-slate-950">
          <AppIcon name="edit" className="h-6 w-6" />
        </button>
      </div>
    </PageContainer>
  )
}
