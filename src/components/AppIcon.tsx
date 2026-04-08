import type { SVGProps } from 'react'
import type { Icon, IconProps } from '@tabler/icons-react'
import * as TablerIcons from '@tabler/icons-react'
import {
  IconAperture,
  IconArrowRight,
  IconArrowUpRight,
  IconBadge,
  IconBookmark,
  IconBriefcase,
  IconChecks,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsDown,
  IconMovie,
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
  IconFolder,
  IconFolderOpen,
  IconFolderPlus,
  IconGridDots,
  IconHelpCircle,
  IconHome,
  IconImageInPicture,
  IconKey,
  IconLayoutDashboard,
  IconLocation,
  IconMail,
  IconMenu2,
  IconMessageCircle,
  IconMoon,
  IconMusic,
  IconLayoutSidebarLeftCollapse,
  IconPalette,
  IconPencil,
  IconPencilBolt,
  IconPencilCog,
  IconPhoto,
  IconPlayerPlay,
  IconPlus,
  IconSearch,
  IconSettings,
  IconSquareRoundedLetterC,
  IconSun,
  IconTerminal2,
  IconTemperature,
  IconUpload,
  IconUserCircle,
  IconX,
} from '@tabler/icons-react'


const iconMap: Record<string, Icon> = {
  account_circle: IconUserCircle,
  add: IconPlus,
  apps: IconGridDots,
  arrow_forward: IconArrowRight,
  badge: IconBadge,
  blur_on: IconAperture,
  bookmarks: IconBookmark,
  calendar_today: IconSquareRoundedLetterC,
  check: IconChecks,
  chevron_left: IconChevronLeft,
  chevron_right: IconChevronRight,
  cloud: IconCloud,
  close: IconX,
  contrast: IconContrast2,
  create_new_folder: IconFolderPlus,
  dark_mode: IconMoon,
  dashboard_customize: IconLayoutDashboard,
  database: IconDatabase,
  device_thermostat: IconTemperature,
  download: IconDownload,
  draw: IconPencil,
  edit: IconPencil,
  edit_note: IconPencilBolt,
  edit_square: IconPencilCog,
  folder: IconFolder,
  folder_open: IconFolderOpen,
  foggy: IconCloudFog,
  forum: IconMessageCircle,
  home: IconHome,
  light_mode: IconSun,
  manage_search: IconSearch,
  menu: IconMenu2,
  movie: IconMovie,
  music_note: IconMusic,
  my_location: IconLocation,
  mail: IconMail,
  north_east: IconArrowUpRight,
  opacity: IconDroplet,
  open_in_new: IconExternalLink,
  palette: IconPalette,
  partly_cloudy_day: IconCloudUp,
  password: IconKey,
  play_arrow: IconPlayerPlay,
  rainy: IconCloudRain,
  rainy_heavy: IconCloudRain,
  routine: IconAperture,
  school: IconPhoto,
  settings: IconSettings,
  snowing: IconCloudSnow,
  sunny: IconSun,
  terminal: IconTerminal2,
  theaters: IconMovie,
  thunderstorm: IconCloudStorm,
  travel_explore: IconCompass,
  unfold_more: IconChevronsDown,
  upload: IconUpload,
  wallpaper: IconImageInPicture,
  weather_mix: IconCloudRain,
  weather_snowy: IconCloudSnow,
  work: IconBriefcase,
  left_panel_close: IconLayoutSidebarLeftCollapse,
}

const tablerExports = TablerIcons as Record<string, unknown>

function isTablerIcon(value: unknown): value is Icon {
  if (typeof value === 'function') return true
  // @tabler/icons-react v3 uses React.forwardRef, so icons are objects
  if (value != null && typeof value === 'object' && 'render' in value && typeof (value as Record<string, unknown>).render === 'function') return true
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

  const mapped = iconMap[key]
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
  const IconComponent = resolveIcon(name, fallback)
  return <IconComponent aria-hidden="true" stroke={1.8} {...props} />
}

export function IconSpan({ children, ...props }: SVGProps<SVGSVGElement> & { children: string | null | undefined }) {
  return <AppIcon name={typeof children === 'string' ? children : undefined} {...props} />
}
