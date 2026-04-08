import { useState, type SVGProps } from 'react'
import type { Icon, IconProps } from '@tabler/icons-react'
import * as TablerIcons from '@tabler/icons-react'
import { getNamedIconUrl } from '../lib/favicon'
import {
  IconAperture,
  IconArrowRight,
  IconArrowUpRight,
  IconBadge,
  IconChecks,
  IconChevronDown,
  IconCloud,
  IconCloudFog,
  IconCloudRain,
  IconCloudSnow,
  IconCloudStorm,
  IconCloudUp,
  IconCompass,
  IconContrast2,
  IconDatabase,
  IconDownload,
  IconDroplet,
  IconExternalLink,
  IconFolderOpen,
  IconFolderPlus,
  IconGridDots,
  IconHelpCircle,
  IconHome,
  IconImageInPicture,
  IconKey,
  IconLayoutDashboard,
  IconLayoutSidebarLeftCollapse,
  IconLocation,
  IconMenu2,
  IconMoon,
  IconPalette,
  IconPencil,
  IconPencilBolt,
  IconPencilCog,
  IconPlus,
  IconSearch,
  IconSettings,
  IconSquareRoundedLetterC,
  IconSun,
  IconTemperature,
  IconUpload,
  IconUserCircle,
  IconX,
} from '@tabler/icons-react'

const iconMap: Record<string, Icon> = {
  account_circle: IconUserCircle,
  add: IconPlus,
  aperture: IconAperture,
  apps: IconGridDots,
  arrow_forward: IconArrowRight,
  badge: IconBadge,
  blur_on: IconAperture,
  calendar_today: IconSquareRoundedLetterC,
  check: IconChecks,
  checks: IconChecks,
  chevrons_down: IconChevronDown,
  'chevrons-down': IconChevronDown,
  cloud: IconCloud,
  close: IconX,
  contrast: IconContrast2,
  'contrast-2': IconContrast2,
  create_new_folder: IconFolderPlus,
  dark_mode: IconMoon,
  dashboard_customize: IconLayoutDashboard,
  database: IconDatabase,
  device_thermostat: IconTemperature,
  download: IconDownload,
  draw: IconPencil,
  edit_note: IconPencilBolt,
  edit_square: IconPencilCog,
  'external-link': IconExternalLink,
  folder_open: IconFolderOpen,
  'folder-open': IconFolderOpen,
  folder_plus: IconFolderPlus,
  'folder-plus': IconFolderPlus,
  foggy: IconCloudFog,
  grid_dots: IconGridDots,
  'grid-dots': IconGridDots,
  home: IconHome,
  image_in_picture: IconImageInPicture,
  'layout-dashboard': IconLayoutDashboard,
  left_panel_close: IconLayoutSidebarLeftCollapse,
  'layout-sidebar-left-collapse': IconLayoutSidebarLeftCollapse,
  light_mode: IconSun,
  manage_search: IconSearch,
  menu: IconMenu2,
  menu_2: IconMenu2,
  'menu-2': IconMenu2,
  moon: IconMoon,
  my_location: IconLocation,
  north_east: IconArrowUpRight,
  opacity: IconDroplet,
  open_in_new: IconExternalLink,
  palette: IconPalette,
  partly_cloudy_day: IconCloudUp,
  password: IconKey,
  'pencil-cog': IconPencilCog,
  rainy: IconCloudRain,
  rainy_heavy: IconCloudRain,
  routine: IconAperture,
  search: IconSearch,
  settings: IconSettings,
  snowing: IconCloudSnow,
  sun: IconSun,
  sunny: IconSun,
  thunderstorm: IconCloudStorm,
  travel_explore: IconCompass,
  unfold_more: IconChevronDown,
  upload: IconUpload,
  'user-circle': IconUserCircle,
  wallpaper: IconImageInPicture,
  weather_mix: IconCloudRain,
  weather_snowy: IconCloudSnow,
  x: IconX,
}

const tablerExports = TablerIcons as Record<string, unknown>

function isTablerIcon(value: unknown): value is Icon {
  if (typeof value !== 'function') return false
  const iconCandidate = value as unknown as Record<string, unknown>
  if ('displayName' in iconCandidate) return true
  if ('iconNode' in iconCandidate) return true
  if (typeof iconCandidate.render === 'function') return true
  return false
}

function toTablerExportName(name: string) {
  const normalized = name
    .trim()
    .replace(/^icon(?=[A-Z0-9])/, '')
    .replace(/^icon[-_\s]+/i, '')
    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
    .split(/[^a-zA-Z0-9]+|(?<=[a-z0-9])(?=[A-Z])/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join('')

  return normalized ? `Icon${normalized}` : ''
}

function resolveIcon(name: string | null | undefined, fallback: Icon) {
  const key = name?.trim()
  if (!key) return fallback

  const mapped = iconMap[key] ?? iconMap[key.replace(/-/g, '_')]
  if (mapped) return mapped

  const direct = tablerExports[key]
  if (isTablerIcon(direct)) return direct

  const normalizedKey = toTablerExportName(key)
  if (!normalizedKey) return fallback

  const normalized = tablerExports[normalizedKey]
  return isTablerIcon(normalized) ? normalized : fallback
}

type AppIconProps = Omit<IconProps, 'ref'> & {
  name: string | null | undefined
  fallback?: Icon
}

export function AppIcon({ name, fallback = IconHelpCircle, ...props }: AppIconProps) {
  const {
    className,
    stroke: _stroke,
    ...restProps
  } = props
  const trimmedName = name?.trim()
  const resolvedIcon = trimmedName ? resolveIcon(trimmedName, fallback) : fallback
  const hasLocalIcon = !trimmedName || resolvedIcon !== fallback
  const [namedIconFailed, setNamedIconFailed] = useState(false)

  if (trimmedName && !hasLocalIcon && !namedIconFailed) {
    const namedIconUrl = getNamedIconUrl(trimmedName)

    if (namedIconUrl) {
    return (
        <img
          src={namedIconUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={() => setNamedIconFailed(true)}
          className={[className, 'object-contain'].filter(Boolean).join(' ')}
        />
    )
    }
  }

  const IconComponent = resolvedIcon

  return (
    <IconComponent
      aria-hidden="true"
      stroke={1.8}
      className={["text-primary dark:text-primary", className].filter(Boolean).join(' ')}
      {...restProps}
    />
  )
}

export function IconSpan({ children, ...props }: SVGProps<SVGSVGElement> & { children: string | null | undefined }) {
  return <AppIcon name={typeof children === 'string' ? children : undefined} {...props} />
}
