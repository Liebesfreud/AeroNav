export function BookmarksPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-4">
          <h1 className="text-5xl font-headline font-bold text-on-background tracking-tight">Your Sanctuary</h1>
          <p className="text-on-background/60 font-body text-lg max-w-lg leading-relaxed">A curated collection of digital spaces, organized with clarity and purpose.</p>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <button className="bg-[#f3f4f1] text-[#2f3331] px-6 py-3 rounded-lg font-label font-semibold flex items-center gap-2 hover:bg-white hover:shadow-sm border border-outline/40 transition-all outline-none">
            <span className="material-symbols-outlined text-xs">folder_open</span>
            Organize
          </button>
          <button className="bg-[#99462a] text-white px-8 py-3 rounded-lg font-label font-bold flex items-center gap-2 shadow-md shadow-[#99462a]/10 hover:opacity-90 active:scale-95 transition-all outline-none">
            <span className="material-symbols-outlined text-sm">add</span>
            Add Bookmark
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Category: Design Tools */}
        <section className="lg:col-span-8 flex flex-col gap-8">
          <div className="flex items-center justify-between border-b border-outline pb-4">
            <h2 className="text-xl font-headline font-bold text-[#2f3331] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#99462a] rounded-full"></span>
              Design Tools
            </h2>
            <span className="text-xs font-label font-bold uppercase tracking-widest text-[#2f3331]/40">4 items</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group paper-card rounded-lg p-8 ring-1 ring-outline/30 relative flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className="w-10 h-10 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                  <img alt="Figma" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZ7fJo-unr1tzwhbAlzQhhPmZzsbzdtnS_CVzi7zV4HU9dOEeTVha2AUaLyEib2dHyJ01xmiZRaOYymbYpp_apU0pRwhbXqv7tE6Y_s8yFHLrzmsx4-1OSRAq6fLpmNgGU5od9L9QTgUpFTT6sB96o8Av8apZNLvWclgW5mltqTD58pD0tT0PIYU6ve7VtiSVaEXa3UkUeAy1CJnK52bimXwQ0uSLOweAbYC8uslS23CKNFBSSxijp7HpUEOWloTxJX5asGflsHIo" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button className="p-1.5 hover:bg-[#f3f4f1] rounded text-[#2f3331]/50 hover:text-[#99462a]">
                    <span className="material-symbols-outlined text-lg">edit_note</span>
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-headline font-bold mb-2 group-hover:text-[#99462a] transition-colors relative z-10 w-fit pointer-events-none">Figma Dashboard</h3>
              <p className="text-[#2f3331]/60 text-sm line-clamp-2 font-body mb-6 leading-relaxed flex-1">Collaborative interface design tool for teams and designers.</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className="text-[10px] font-bold font-mono text-[#2f3331]/30 tracking-tight">FIGMA.COM</span>
              </div>
              <a className="absolute inset-0 z-0" href="#"></a>
            </div>

            <div className="group paper-card rounded-lg p-8 ring-1 ring-outline/30 relative flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className="w-10 h-10 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                  <img alt="Framer" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClKK2A2wOfty9bwT7R4Xz-rm39Hx2LFaSNgeZP29kJAbjqkEMtit_Sjw3o6GUm01jrKtnv-M9wBzOWZa9iNpE9kPkw-kOd43JykVpPiSKyMrZYp_4mYkn7i9aYH4b4GmLZ5mS5zfeBnt8Fc7kHLJTpIvZFuML7X77JX328YYXQUE33RzGMf48TfwpkvAr0B2gGwNxxD9syvkH9pwvJPM_-rZJWsCYM-WM7giQPUJK7235tkxQL2Qn08CKKOXVl0Fc65yNFxo-eWuE" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button className="p-1.5 hover:bg-[#f3f4f1] rounded text-[#2f3331]/50 hover:text-[#99462a]">
                    <span className="material-symbols-outlined text-lg">edit_note</span>
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-headline font-bold mb-2 group-hover:text-[#99462a] transition-colors relative z-10 w-fit pointer-events-none">Framer Sites</h3>
              <p className="text-[#2f3331]/60 text-sm line-clamp-2 font-body mb-6 leading-relaxed flex-1">Next-generation site builder for production-ready design.</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className="text-[10px] font-bold font-mono text-[#2f3331]/30 tracking-tight">FRAMER.COM</span>
              </div>
              <a className="absolute inset-0 z-0" href="#"></a>
            </div>
          </div>
        </section>

        {/* Category: Work */}
        <section className="lg:col-span-4 flex flex-col gap-8">
          <div className="flex items-center justify-between border-b border-outline pb-4">
            <h2 className="text-xl font-headline font-bold text-[#2f3331]">Work</h2>
            <span className="text-xs font-label font-bold uppercase tracking-widest text-[#2f3331]/40">3 items</span>
          </div>
          <div className="paper-card rounded-lg p-2 ring-1 ring-outline/30 flex flex-col relative z-10">
            <div className="flex items-center gap-4 p-4 hover:bg-[#f3f4f1]/50 rounded transition-all cursor-pointer group border-b border-outline last:border-0 border-dashed relative">
              <a className="absolute inset-0 z-10" href="#"></a>
              <div className="w-8 h-8 text-[#99462a] flex items-center justify-center">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-[#2f3331]">Gmail Inbox</p>
                <p className="text-[11px] text-[#2f3331]/50">24 unread messages</p>
              </div>
              <span className="material-symbols-outlined text-xs text-[#2f3331]/30 group-hover:text-[#99462a]">north_east</span>
            </div>
            
            <div className="flex items-center gap-4 p-4 hover:bg-[#f3f4f1]/50 rounded transition-all cursor-pointer group border-b border-outline last:border-0 border-dashed relative">
              <a className="absolute inset-0 z-10" href="#"></a>
              <div className="w-8 h-8 text-[#99462a] flex items-center justify-center">
                <span className="material-symbols-outlined">terminal</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-[#2f3331]">GitHub Repos</p>
                <p className="text-[11px] text-[#2f3331]/50">Updated 2h ago</p>
              </div>
              <span className="material-symbols-outlined text-xs text-[#2f3331]/30 group-hover:text-[#99462a]">north_east</span>
            </div>
            
            <div className="flex items-center gap-4 p-4 hover:bg-[#f3f4f1]/50 rounded transition-all cursor-pointer group border-b border-outline last:border-0 border-dashed relative">
               <a className="absolute inset-0 z-10" href="#"></a>
              <div className="w-8 h-8 text-[#99462a] flex items-center justify-center">
                <span className="material-symbols-outlined">calendar_today</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-[#2f3331]">Calendar</p>
                <p className="text-[11px] text-[#2f3331]/50">3 upcoming meetings</p>
              </div>
              <span className="material-symbols-outlined text-xs text-[#2f3331]/30 group-hover:text-[#99462a]">north_east</span>
            </div>
          </div>
          
          <div className="bg-[#2f3331] rounded-lg p-8 text-white relative z-10">
            <p className="text-white/40 font-label text-[10px] uppercase font-bold tracking-[0.2em] mb-4">Library Summary</p>
            <p className="text-5xl font-headline font-bold mb-4">142</p>
            <p className="text-white/60 font-body text-sm leading-relaxed">Organized across 8 catalogs. Your library grew by 12% this week.</p>
          </div>
        </section>

        {/* Category: Learning */}
        <section className="lg:col-span-12 flex flex-col gap-8 mt-12">
          <div className="flex items-center justify-between border-b border-outline pb-4">
            <h2 className="text-xl font-headline font-bold text-[#2f3331]">Learning & Research</h2>
            <div className="flex gap-2 relative z-10">
              <button className="w-8 h-8 flex items-center justify-center border border-outline rounded hover:bg-white transition-colors cursor-pointer outline-none">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-outline rounded hover:bg-white transition-colors cursor-pointer outline-none">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
            <div className="min-w-[340px] paper-card rounded-lg overflow-hidden border border-outline/30 group relative">
              <a className="absolute inset-0 z-10" href="#"></a>
              <div className="h-40 bg-[#f3f4f1] relative overflow-hidden">
                <img className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-N5N0UhbfC8QEN0OIdvqaxpkC3Nolx7oX060zS2viphIGQ2OfqKZwrQnWIKkjjfKyTswE-_jnojhzmpgFGpRuHjJKRguwt-n6y2E3ZJs5shBB2hApb3jka2WrJNKXfVIpW7Ih8I27cQdTY-M7BIs6QTft17s7FYYoC_3RYutDNlCC-1aC1hnnf2m6i81Slb3tssrHOA_B91ZqfXpqaOZyncqMpb3gOUaeQoUPDUlv23S_YS7EPkF1fqPlKfd99fAECiiVjSFYQP0" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
              </div>
              <div className="p-6 relative z-0">
                <h3 className="font-bold text-base mb-1 text-[#2f3331] group-hover:text-[#99462a] transition-colors">MDN Web Docs</h3>
                <p className="text-[#2f3331]/50 text-xs mb-4">Web developer resources.</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold font-mono text-[#2f3331]/30">DEVELOPER.MOZILLA.ORG</span>
                  <span className="material-symbols-outlined text-base text-[#2f3331]/30 group-hover:text-[#99462a]">arrow_forward</span>
                </div>
              </div>
            </div>

            <div className="min-w-[340px] paper-card rounded-lg overflow-hidden border border-outline/30 group relative">
              <a className="absolute inset-0 z-10" href="#"></a>
              <div className="h-40 bg-[#f3f4f1] relative overflow-hidden">
                <img className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2nXJU09ViY9gKpc3ukA5UfHCvyclNDiGe33aBw_CCuhZv2vRi6H3NL0gdDQ_6BozIYx7s9Wb2VHvNpDTXWxSITlcytGpR_EIGjsbZxhcCyHjeK50G2EJuQ2bvEgJASW6YmPkvx55lpQ95qh8tSWpTTjDK48g2aGXhn3xhSfPBzVo84OgpK4qUYy8f9o9BFojBRrbbmOOU7b4-DSP4h7dKixwDv_LaDLi6dBZ6gXtPPXP3YuNp1tzgchljHrGXFfuno73NPNvina4" />
              </div>
              <div className="p-6 relative z-0">
                <h3 className="font-bold text-base mb-1 text-[#2f3331] group-hover:text-[#99462a] transition-colors">Frontend Masters</h3>
                <p className="text-[#2f3331]/50 text-xs mb-4">Deep dive video courses.</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold font-mono text-[#2f3331]/30">FRONTENDMASTERS.COM</span>
                  <span className="material-symbols-outlined text-base text-[#2f3331]/30 group-hover:text-[#99462a]">arrow_forward</span>
                </div>
              </div>
            </div>

            <div className="min-w-[340px] paper-card rounded-lg overflow-hidden border border-outline/30 group relative">
              <a className="absolute inset-0 z-10" href="#"></a>
              <div className="h-40 bg-[#f3f4f1] relative overflow-hidden">
                <img className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOYhHfb1fdZ_84kmYK2tj9Iui4YHf02kyXGc-HY6QeRxNGaZoCdZPU_y12XjdBIE1zcIYblAdbJZeD0xqPUGM1wmt7IsOhiQ-Mkw1N1VbhLvJ44ZGLs5DxjSdYwOZBg6uPw1eels0AUqtANsrUSW9DZrU6eoC1UTy_J4gVuIDcXM-c-CNXnWkhwnXzhtr9boILo4SALRJjjYaeZdRhSUs-qLxqYseO55dptEugcgNx39zeXeS8bvLrcPPVEuNpjkopJ9gIeGe2QaY" />
              </div>
              <div className="p-6 relative z-0">
                <h3 className="font-bold text-base mb-1 text-[#2f3331] group-hover:text-[#99462a] transition-colors">The CSS Podcast</h3>
                <p className="text-[#2f3331]/50 text-xs mb-4">Modern CSS design tips.</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold font-mono text-[#2f3331]/30">PODCASTS.GOOGLE.COM</span>
                  <span className="material-symbols-outlined text-base text-[#2f3331]/30 group-hover:text-[#99462a]">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category: Entertainment */}
        <section className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 mb-24">
          <div className="md:col-span-2 lg:col-span-4 flex items-center justify-between border-b border-outline pb-4">
            <h2 className="text-xl font-headline font-bold text-[#2f3331]">Entertainment</h2>
            <button className="text-xs font-bold font-label text-[#99462a] hover:opacity-70 transition-opacity outline-none relative z-10 cursor-pointer">Browse Catalog</button>
          </div>
          
          <a href="#" className="paper-card rounded p-4 flex items-center gap-4 group cursor-pointer border border-outline/20 relative">
            <div className="w-10 h-10 rounded bg-[#f3f4f1] text-[#99462a] flex items-center justify-center transition-colors group-hover:bg-[#99462a] group-hover:text-white">
              <span className="material-symbols-outlined text-lg">play_arrow</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-[#2f3331] group-hover:text-[#99462a] transition-colors">YouTube</p>
              <p className="text-[9px] font-bold text-[#2f3331]/40 uppercase tracking-wider">Video</p>
            </div>
          </a>
          
          <a href="#" className="paper-card rounded p-4 flex items-center gap-4 group cursor-pointer border border-outline/20 relative">
            <div className="w-10 h-10 rounded bg-[#f3f4f1] text-[#99462a] flex items-center justify-center transition-colors group-hover:bg-[#99462a] group-hover:text-white">
              <span className="material-symbols-outlined text-lg">music_note</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-[#2f3331] group-hover:text-[#99462a] transition-colors">Spotify</p>
              <p className="text-[9px] font-bold text-[#2f3331]/40 uppercase tracking-wider">Music</p>
            </div>
          </a>
          
          <a href="#" className="paper-card rounded p-4 flex items-center gap-4 group cursor-pointer border border-outline/20 relative">
            <div className="w-10 h-10 rounded bg-[#f3f4f1] text-[#99462a] flex items-center justify-center transition-colors group-hover:bg-[#99462a] group-hover:text-white">
              <span className="material-symbols-outlined text-lg">forum</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-[#2f3331] group-hover:text-[#99462a] transition-colors">Reddit</p>
              <p className="text-[9px] font-bold text-[#2f3331]/40 uppercase tracking-wider">Social</p>
            </div>
          </a>
          
          <a href="#" className="paper-card rounded p-4 flex items-center gap-4 group cursor-pointer border border-outline/20 relative">
            <div className="w-10 h-10 rounded bg-[#f3f4f1] text-[#99462a] flex items-center justify-center transition-colors group-hover:bg-[#99462a] group-hover:text-white">
              <span className="material-symbols-outlined text-lg">movie</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-[#2f3331] group-hover:text-[#99462a] transition-colors">Netflix</p>
              <p className="text-[9px] font-bold text-[#2f3331]/40 uppercase tracking-wider">Streaming</p>
            </div>
          </a>
        </section>
      </div>

      <button className="fixed bottom-10 right-10 w-14 h-14 bg-[#2f3331] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#99462a] hover:scale-110 transition-all z-50 outline-none">
        <span className="material-symbols-outlined text-2xl">edit</span>
      </button>
    </div>
  )
}
