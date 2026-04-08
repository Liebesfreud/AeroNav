import { useState, type SVGProps } from 'react'
import { Icon as IconifyIcon } from '@iconify/react'
import type { Icon, IconProps } from '@tabler/icons-react'
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

function resolveIcon(name: string | null | undefined, fallback: Icon) {
  const key = name?.trim()
  if (!key) return fallback

  return iconMap[key] ?? iconMap[key.replace(/-/g, '_')] ?? fallback
}

type AppIconProps = Omit<IconProps, 'ref'> & {
  name: string | null | undefined
  fallback?: Icon
}

export function AppIcon({ name, fallback = IconHelpCircle, ...props }: AppIconProps) {
  const {
    className,
    stroke: _stroke,
    color,
    width,
    height,
    style,
    onClick,
    role,
    tabIndex,
    ...restProps
  } = props
  const trimmedName = name?.trim()
  const mappedIcon = trimmedName ? iconMap[trimmedName] ?? iconMap[trimmedName.replace(/-/g, '_')] : null
  const [iconifyFailed, setIconifyFailed] = useState(false)

  if (trimmedName && !mappedIcon && !iconifyFailed) {
    return (
      <span
        aria-hidden="true"
        onErrorCapture={() => setIconifyFailed(true)}
        className="inline-flex items-center justify-center"
      >
        <IconifyIcon
          icon={trimmedName}
          color={typeof color === 'string' ? color : undefined}
          width={typeof width === 'string' || typeof width === 'number' ? width : undefined}
          height={typeof height === 'string' || typeof height === 'number' ? height : undefined}
          style={style}
          onClick={onClick}
          role={role}
          tabIndex={tabIndex}
          className={["text-primary dark:text-primary", className].filter(Boolean).join(' ')}
        />
      </span>
    )
  }

  const IconComponent = resolveIcon(trimmedName, fallback)

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
