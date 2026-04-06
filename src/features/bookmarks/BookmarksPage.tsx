export function BookmarksPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-4">
          <h1 className="text-5xl font-headline font-bold text-on-background tracking-tight dark:text-dark-on-background">Your Sanctuary</h1>
          <p className="max-w-lg font-body text-lg leading-relaxed text-on-surface-variant dark:text-dark-on-surface-variant">A curated collection of digital spaces, organized with clarity and purpose.</p>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <button className="flex items-center gap-2 rounded-lg border border-outline/50 bg-surface-container px-6 py-3 font-label font-semibold text-on-surface transition-all outline-none hover:bg-surface hover:shadow-sm dark:border-dark-outline/80 dark:bg-dark-surface-container dark:text-dark-on-surface dark:hover:bg-dark-surface-elevated">
            <span className="material-symbols-outlined text-xs">folder_open</span>
            Organize
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-label font-bold text-white shadow-md shadow-[#99462a]/10 transition-all outline-none hover:opacity-90 active:scale-95 dark:bg-accent dark:text-slate-950 dark:shadow-none">
            <span className="material-symbols-outlined text-sm">add</span>
            Add Bookmark
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <section className="flex flex-col gap-8 lg:col-span-8">
          <div className="flex items-center justify-between border-b border-outline pb-4 dark:border-dark-outline/80">
            <h2 className="flex items-center gap-2 text-xl font-headline font-bold text-on-background dark:text-dark-on-background">
              <span className="h-2 w-2 rounded-full bg-primary dark:bg-accent"></span>
              Design Tools
            </h2>
            <span className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant">4 items</span>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="group paper-card relative flex flex-col rounded-lg p-8 ring-1 ring-outline/30 dark:ring-dark-outline/70">
              <div className="mb-8 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center grayscale transition-all group-hover:grayscale-0">
                  <img alt="Figma" className="h-full w-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZ7fJo-unr1tzwhbAlzQhhPmZzsbzdtnS_CVzi7zV4HU9dOEeTVha2AUaLyEib2dHyJ01xmiZRaOYymbYpp_apU0pRwhbXqv7tE6Y_s8yFHLrzmsx4-1OSRAq6fLpmNgGU5od9L9QTgUpFTT6sB96o8Av8apZNLvWclgW5mltqTD58pD0tT0PIYU6ve7VtiSVaEXa3UkUeAy1CJnK52bimXwQ0uSLOweAbYC8uslS23CKNFBSSxijp7HpUEOWloTxJX5asGflsHIo" />
                </div>
                <div className="z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-primary dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container dark:hover:text-accent">
                    <span className="material-symbols-outlined text-lg">edit_note</span>
                  </button>
                </div>
              </div>
              <h3 className="pointer-events-none relative z-10 mb-2 w-fit text-lg font-headline font-bold transition-colors group-hover:text-primary dark:text-dark-on-background dark:group-hover:text-accent">Figma Dashboard</h3>
              <p className="mb-6 flex-1 font-body text-sm leading-relaxed text-on-surface-variant dark:text-dark-on-surface-variant">Collaborative interface design tool for teams and designers.</p>
              <div className="mt-auto flex items-center gap-2">
                <span className="text-[10px] font-bold font-mono tracking-tight text-on-surface-variant/60 dark:text-dark-on-surface-variant/70">FIGMA.COM</span>
              </div>
              <a className="absolute inset-0 z-0" href="#"></a>
            </div>

            <div className="group paper-card relative flex flex-col rounded-lg p-8 ring-1 ring-outline/30 dark:ring-dark-outline/70">
              <div className="mb-8 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center grayscale transition-all group-hover:grayscale-0">
                  <img alt="Framer" className="h-full w-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClKK2A2wOfty9bwT7R4Xz-rm39Hx2LFaSNgeZP29kJAbjqkEMtit_Sjw3o6GUm01jrKtnv-M9wBzOWZa9iNpE9kPkw-kOd43JykVpPiSKyMrZYp_4mYkn7i9aYH4b4GmLZ5mS5zfeBnt8Fc7kHLJTpIvZFuML7X77JX328YYXQUE33RzGMf48TfwpkvAr0B2gGwNxxD9syvkH9pwvJPM_-rZJWsCYM-WM7giQPUJK7235tkxQL2Qn08CKKOXVl0Fc65yNFxo-eWuE" />
                </div>
                <div className="z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-primary dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container dark:hover:text-accent">
                    <span className="material-symbols-outlined text-lg">edit_note</span>
                  </button>
                </div>
              </div>
              <h3 className="pointer-events-none relative z-10 mb-2 w-fit text-lg font-headline font-bold transition-colors group-hover:text-primary dark:text-dark-on-background dark:group-hover:text-accent">Framer Sites</h3>
              <p className="mb-6 flex-1 font-body text-sm leading-relaxed text-on-surface-variant dark:text-dark-on-surface-variant">Next-generation site builder for production-ready design.</p>
              <div className="mt-auto flex items-center gap-2">
                <span className="text-[10px] font-bold font-mono tracking-tight text-on-surface-variant/60 dark:text-dark-on-surface-variant/70">FRAMER.COM</span>
              </div>
              <a className="absolute inset-0 z-0" href="#"></a>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8 lg:col-span-4">
          <div className="flex items-center justify-between border-b border-outline pb-4 dark:border-dark-outline/80">
            <h2 className="text-xl font-headline font-bold text-on-background dark:text-dark-on-background">Work</h2>
            <span className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant">3 items</span>
          </div>
          <div className="paper-card relative z-10 flex flex-col rounded-lg p-2 ring-1 ring-outline/30 dark:ring-dark-outline/70">
            <div className="group relative flex cursor-pointer items-center gap-4 rounded border-b border-dashed border-outline p-4 transition-all last:border-0 hover:bg-surface-container/60 dark:border-dark-outline/70 dark:hover:bg-dark-surface-container/60">
              <a className="absolute inset-0 z-10" href="#"></a>
              <div className="flex h-8 w-8 items-center justify-center text-primary dark:text-accent">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-background dark:text-dark-on-background">Gmail Inbox</p>
                <p className="text-[11px] text-on-surface-variant dark:text-dark-on-surface-variant">24 unread messages</p>
              </div>
              <span className="material-symbols-outlined text-xs text-on-surface-variant transition-colors group-hover:text-primary dark:text-dark-on-surface-variant dark:group-hover:text-accent">north_east</span>
            </div>

            <div className="group relative flex cursor-pointer items-center gap-4 rounded border-b border-dashed border-outline p-4 transition-all last:border-0 hover:bg-surface-container/60 dark:border-dark-outline/70 dark:hover:bg-dark-surface-container/60">
              <a className="absolute inset-0 z-10" href="#"></a>
              <div className="flex h-8 w-8 items-center justify-center text-primary dark:text-accent">
                <span className="material-symbols-outlined">terminal</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-background dark:text-dark-on-background">GitHub Repos</p>
                <p className="text-[11px] text-on-surface-variant dark:text-dark-on-surface-variant">Updated 2h ago</p>
              </div>
              <span className="material-symbols-outlined text-xs text-on-surface-variant transition-colors group-hover:text-primary dark:text-dark-on-surface-variant dark:group-hover:text-accent">north_east</span>
            </div>

            <div className="group relative flex cursor-pointer items-center gap-4 rounded border-b border-dashed border-outline p-4 transition-all last:border-0 hover:bg-surface-container/60 dark:border-dark-outline/70 dark:hover:bg-dark-surface-container/60">
              <a className="absolute inset-0 z-10" href="#"></a>
              <div className="flex h-8 w-8 items-center justify-center text-primary dark:text-accent">
                <span className="material-symbols-outlined">calendar_today</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-background dark:text-dark-on-background">Calendar</p>
                <p className="text-[11px] text-on-surface-variant dark:text-dark-on-surface-variant">3 upcoming meetings</p>
              </div>
              <span className="material-symbols-outlined text-xs text-on-surface-variant transition-colors group-hover:text-primary dark:text-dark-on-surface-variant dark:group-hover:text-accent">north_east</span>
            </div>
          </div>

          <div className="relative z-10 rounded-lg bg-on-background p-8 text-white dark:bg-dark-surface-elevated dark:text-dark-on-background">
            <p className="mb-4 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 dark:text-dark-on-surface-variant">Library Summary</p>
            <p className="mb-4 text-5xl font-headline font-bold">142</p>
            <p className="font-body text-sm leading-relaxed text-white/60 dark:text-dark-on-surface-variant">Organized across 8 catalogs. Your library grew by 12% this week.</p>
          </div>
        </section>

        <section className="mt-12 flex flex-col gap-8 lg:col-span-12">
          <div className="flex items-center justify-between border-b border-outline pb-4 dark:border-dark-outline/80">
            <h2 className="text-xl font-headline font-bold text-on-background dark:text-dark-on-background">Learning & Research</h2>
            <div className="relative z-10 flex gap-2">
              <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-outline transition-colors outline-none hover:bg-surface dark:border-dark-outline/80 dark:hover:bg-dark-surface-elevated">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-outline transition-colors outline-none hover:bg-surface dark:border-dark-outline/80 dark:hover:bg-dark-surface-elevated">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="scrollbar-hide flex gap-8 overflow-x-auto pb-6">
            <div className="group relative min-w-[340px] overflow-hidden rounded-lg border border-outline/30 paper-card dark:border-dark-outline/70">
              <a className="absolute inset-0 z-10" href="#"></a>
              <div className="relative h-40 overflow-hidden bg-surface-container dark:bg-dark-surface-container">
                <img className="h-full w-full object-cover opacity-50 grayscale transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-N5N0UhbfC8QEN0OIdvqaxpkC3Nolx7oX060zS2viphIGQ2OfqKZwrQnWIKkjjfKyTswE-_jnojhzmpgFGpRuHjJKRguwt-n6y2E3ZJs5shBB2hApb3jka2WrJNKXfVIpW7Ih8I27cQdTY-M7BIs6QTft17s7FYYoC_3RYutDNlCC-1aC1hnnf2m6i81Slb3tssrHOA_B91ZqfXpqaOZyncqMpb3gOUaeQoUPDUlv23S_YS7EPkF1fqPlKfd99fAECiiVjSFYQP0" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/20 to-transparent dark:from-black/30"></div>
              </div>
              <div className="relative z-0 p-6">
                <h3 className="mb-1 text-base font-bold text-on-background transition-colors group-hover:text-primary dark:text-dark-on-background dark:group-hover:text-accent">MDN Web Docs</h3>
                <p className="mb-4 text-xs text-on-surface-variant dark:text-dark-on-surface-variant">Web developer resources.</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold font-mono text-on-surface-variant/60 dark:text-dark-on-surface-variant/70">DEVELOPER.MOZILLA.ORG</span>
                  <span className="material-symbols-outlined text-base text-on-surface-variant transition-colors group-hover:text-primary dark:text-dark-on-surface-variant dark:group-hover:text-accent">arrow_forward</span>
                </div>
              </div>
            </div>

            <div className="group relative min-w-[340px] overflow-hidden rounded-lg border border-outline/30 paper-card dark:border-dark-outline/70">
              <a className="absolute inset-0 z-10" href="#"></a>
              <div className="relative h-40 overflow-hidden bg-surface-container dark:bg-dark-surface-container">
                <img className="h-full w-full object-cover opacity-50 grayscale transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2nXJU09ViY9gKpc3ukA5UfHCvyclNDiGe33aBw_CCuhZv2vRi6H3NL0gdDQ_6BozIYx7s9Wb2VHvNpDTXWxSITlcytGpR_EIGjsbZxhcCyHjeK50G2EJuQ2bvEgJASW6YmPkvx55lpQ95qh8tSWpTTjDK48g2aGXhn3xhSfPBzVo84OgpK4qUYy8f9o9BFojBRrbbmOOU7b4-DSP4h7dKixwDv_LaDLi6dBZ6gXtPPXP3YuNp1tzgchljHrGXFfuno73NPNvina4" />
              </div>
              <div className="relative z-0 p-6">
                <h3 className="mb-1 text-base font-bold text-on-background transition-colors group-hover:text-primary dark:text-dark-on-background dark:group-hover:text-accent">Frontend Masters</h3>
                <p className="mb-4 text-xs text-on-surface-variant dark:text-dark-on-surface-variant">Deep dive video courses.</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold font-mono text-on-surface-variant/60 dark:text-dark-on-surface-variant/70">FRONTENDMASTERS.COM</span>
                  <span className="material-symbols-outlined text-base text-on-surface-variant transition-colors group-hover:text-primary dark:text-dark-on-surface-variant dark:group-hover:text-accent">arrow_forward</span>
                </div>
              </div>
            </div>

            <div className="group relative min-w-[340px] overflow-hidden rounded-lg border border-outline/30 paper-card dark:border-dark-outline/70">
              <a className="absolute inset-0 z-10" href="#"></a>
              <div className="relative h-40 overflow-hidden bg-surface-container dark:bg-dark-surface-container">
                <img className="h-full w-full object-cover opacity-50 grayscale transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOYhHfb1fdZ_84kmYK2tj9Iui4YHf02kyXGc-HY6QeRxNGaZoCdZPU_y12XjdBIE1zcIYblAdbJZeD0xqPUGM1wmt7IsOhiQ-Mkw1N1VbhLvJ44ZGLs5DxjSdYwOZBg6uPw1eels0AUqtANsrUSW9DZrU6eoC1UTy_J4gVuIDcXM-c-CNXnWkhwnXzhtr9boILo4SALRJjjYaeZdRhSUs-qLxqYseO55dptEugcgNx39zeXeS8bvLrcPPVEuNpjkopJ9gIeGe2QaY" />
              </div>
              <div className="relative z-0 p-6">
                <h3 className="mb-1 text-base font-bold text-on-background transition-colors group-hover:text-primary dark:text-dark-on-background dark:group-hover:text-accent">The CSS Podcast</h3>
                <p className="mb-4 text-xs text-on-surface-variant dark:text-dark-on-surface-variant">Modern CSS design tips.</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold font-mono text-on-surface-variant/60 dark:text-dark-on-surface-variant/70">PODCASTS.GOOGLE.COM</span>
                  <span className="material-symbols-outlined text-base text-on-surface-variant transition-colors group-hover:text-primary dark:text-dark-on-surface-variant dark:group-hover:text-accent">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 mb-24 grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-12 lg:grid-cols-4">
          <div className="md:col-span-2 lg:col-span-4 flex items-center justify-between border-b border-outline pb-4 dark:border-dark-outline/80">
            <h2 className="text-xl font-headline font-bold text-on-background dark:text-dark-on-background">Entertainment</h2>
            <button className="relative z-10 cursor-pointer text-xs font-bold font-label text-primary transition-opacity outline-none hover:opacity-70 dark:text-accent">Browse Catalog</button>
          </div>

          <a href="#" className="paper-card relative flex items-center gap-4 rounded border border-outline/20 p-4 group cursor-pointer dark:border-dark-outline/70">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-surface-container text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-dark-surface-container dark:text-accent dark:group-hover:bg-accent dark:group-hover:text-slate-950">
              <span className="material-symbols-outlined text-lg">play_arrow</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-on-background transition-colors group-hover:text-primary dark:text-dark-on-background dark:group-hover:text-accent">YouTube</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-dark-on-surface-variant">Video</p>
            </div>
          </a>

          <a href="#" className="paper-card relative flex items-center gap-4 rounded border border-outline/20 p-4 group cursor-pointer dark:border-dark-outline/70">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-surface-container text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-dark-surface-container dark:text-accent dark:group-hover:bg-accent dark:group-hover:text-slate-950">
              <span className="material-symbols-outlined text-lg">music_note</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-on-background transition-colors group-hover:text-primary dark:text-dark-on-background dark:group-hover:text-accent">Spotify</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-dark-on-surface-variant">Music</p>
            </div>
          </a>

          <a href="#" className="paper-card relative flex items-center gap-4 rounded border border-outline/20 p-4 group cursor-pointer dark:border-dark-outline/70">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-surface-container text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-dark-surface-container dark:text-accent dark:group-hover:bg-accent dark:group-hover:text-slate-950">
              <span className="material-symbols-outlined text-lg">forum</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-on-background transition-colors group-hover:text-primary dark:text-dark-on-background dark:group-hover:text-accent">Reddit</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-dark-on-surface-variant">Social</p>
            </div>
          </a>

          <a href="#" className="paper-card relative flex items-center gap-4 rounded border border-outline/20 p-4 group cursor-pointer dark:border-dark-outline/70">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-surface-container text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-dark-surface-container dark:text-accent dark:group-hover:bg-accent dark:group-hover:text-slate-950">
              <span className="material-symbols-outlined text-lg">movie</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-on-background transition-colors group-hover:text-primary dark:text-dark-on-background dark:group-hover:text-accent">Netflix</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-dark-on-surface-variant">Streaming</p>
            </div>
          </a>
        </section>
      </div>

      <button className="fixed bottom-10 right-10 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-on-background text-white shadow-xl transition-all outline-none hover:scale-110 hover:bg-primary dark:bg-dark-surface-elevated dark:text-dark-on-background dark:hover:bg-accent dark:hover:text-slate-950">
        <span className="material-symbols-outlined text-2xl">edit</span>
      </button>
    </div>
  )
}
