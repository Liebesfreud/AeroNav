import { useEffect, useState } from 'react'
import { AppIcon } from '../../components/AppIcon'

const clockFormatter = new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

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
  weather,
}: {
  weather: WeatherState
}) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const timeText = clockFormatter.format(now)
  const dateText = dateFormatter.format(now)

  const weatherNode = weather.mode === 'hidden'
    ? null
    : weather.mode === 'ready'
      ? (
          <div className="flex items-center gap-2">
            <AppIcon name={weather.data.icon} className="h-[17px] w-[17px] text-primary/70 dark:text-primary/80" />
            <span className="font-headline text-lg font-light text-on-background dark:text-dark-on-background">{Math.round(weather.data.temperature)}°{weather.data.unit}</span>
            <span className="font-label text-xs uppercase tracking-[0.18em] text-on-surface-variant dark:text-dark-on-surface-variant">{weather.data.locationName ? `${weather.data.locationName} / ${weather.data.condition}` : weather.data.condition}</span>
          </div>
        )
      : (
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-dark-on-surface-variant">
            <AppIcon name="aperture" className="h-[17px] w-[17px] text-primary/60 dark:text-primary/70" />
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
