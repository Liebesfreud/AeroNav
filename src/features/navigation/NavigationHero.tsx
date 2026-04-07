type WeatherState =
  | { mode: 'hidden' }
  | { mode: 'idle' | 'loading' | 'error'; message: string }
  | {
      mode: 'ready'
      data: {
        temperature: number
        unit: 'C' | 'F'
        condition: string
        icon: string
        locationName: string | null
      }
    }

export function NavigationHero({
  timeText,
  dateText,
  weather,
}: {
  timeText: string
  dateText: string
  weather: WeatherState
}) {
  const weatherNode = weather.mode === 'hidden'
    ? null
    : weather.mode === 'ready'
      ? (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[17px] text-primary/70 dark:text-accent/80">{weather.data.icon}</span>
            <span className="font-headline text-lg font-light text-on-background dark:text-dark-on-background">{Math.round(weather.data.temperature)}°{weather.data.unit}</span>
            <span className="font-label text-xs uppercase tracking-[0.18em] text-on-surface-variant dark:text-dark-on-surface-variant">{weather.data.locationName ? `${weather.data.locationName} / ${weather.data.condition}` : weather.data.condition}</span>
          </div>
        )
      : (
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-dark-on-surface-variant">
            <span className="material-symbols-outlined text-[17px] text-primary/60 dark:text-accent/70">routine</span>
            <span className="font-label text-xs uppercase tracking-[0.18em]">{weather.message}</span>
          </div>
        )

  return (
    <header className="flex flex-col items-center text-center">
      <h1 className="font-headline text-6xl font-normal leading-none tracking-tight text-on-background dark:text-dark-on-background">{timeText}</h1>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-on-surface-variant dark:text-dark-on-surface-variant">
        <span className="font-label text-xs font-medium uppercase tracking-[0.18em]">{dateText}</span>
        {weatherNode ? <span className="hidden h-1 w-1 rounded-full bg-on-surface-variant/30 dark:bg-dark-on-surface-variant/40 sm:block" /> : null}
        {weatherNode}
      </div>
    </header>
  )
}
