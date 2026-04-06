import { ApiError, jsonSuccess } from '../auth/access'

const weatherCodes: Record<number, { condition: string; icon: string }> = {
  0: { condition: '晴朗', icon: 'sunny' },
  1: { condition: '基本晴朗', icon: 'partly_cloudy_day' },
  2: { condition: '局部多云', icon: 'partly_cloudy_day' },
  3: { condition: '阴天', icon: 'cloud' },
  45: { condition: '有雾', icon: 'foggy' },
  48: { condition: '浓雾', icon: 'foggy' },
  51: { condition: '毛毛雨', icon: 'rainy' },
  53: { condition: '小雨', icon: 'rainy' },
  55: { condition: '中雨', icon: 'rainy_heavy' },
  56: { condition: '冻毛毛雨', icon: 'weather_mix' },
  57: { condition: '冻雨', icon: 'weather_mix' },
  61: { condition: '小雨', icon: 'rainy' },
  63: { condition: '中雨', icon: 'rainy_heavy' },
  65: { condition: '大雨', icon: 'rainy_heavy' },
  66: { condition: '冻雨', icon: 'weather_mix' },
  67: { condition: '强冻雨', icon: 'weather_mix' },
  71: { condition: '小雪', icon: 'weather_snowy' },
  73: { condition: '中雪', icon: 'weather_snowy' },
  75: { condition: '大雪', icon: 'snowing' },
  77: { condition: '雪粒', icon: 'weather_snowy' },
  80: { condition: '阵雨', icon: 'rainy' },
  81: { condition: '强阵雨', icon: 'rainy_heavy' },
  82: { condition: '暴雨', icon: 'rainy_heavy' },
  85: { condition: '阵雪', icon: 'weather_snowy' },
  86: { condition: '强阵雪', icon: 'snowing' },
  95: { condition: '雷暴', icon: 'thunderstorm' },
  96: { condition: '雷暴夹小冰雹', icon: 'thunderstorm' },
  99: { condition: '雷暴夹大冰雹', icon: 'thunderstorm' },
}

const forecastSchema = {
  isForecastResponse(value: unknown): value is {
    current: {
      temperature_2m: number
      weather_code: number
      time: string
    }
  } {
    if (typeof value !== 'object' || value === null || !('current' in value)) return false
    const current = (value as { current?: unknown }).current
    return typeof current === 'object' && current !== null
      && typeof (current as { temperature_2m?: unknown }).temperature_2m === 'number'
      && typeof (current as { weather_code?: unknown }).weather_code === 'number'
      && typeof (current as { time?: unknown }).time === 'string'
  },
}

const reverseSchema = {
  isReverseResponse(value: unknown): value is {
    results?: Array<{
      name?: string
      admin1?: string
      country?: string
    }>
  } {
    return typeof value === 'object' && value !== null
  },
}

function getCondition(weatherCode: number) {
  return weatherCodes[weatherCode] ?? { condition: '天气未知', icon: 'cloud' }
}

function normalizeUnit(unit: string | null) {
  return unit === 'f' ? 'fahrenheit' : 'celsius'
}

function outputUnit(unit: string | null) {
  return unit === 'f' ? 'F' : 'C'
}

function formatLocation(result: { name?: string; admin1?: string; country?: string } | undefined) {
  if (!result?.name) return null
  const parts = [result.name, result.admin1, result.country].filter(Boolean)
  return parts.join(' / ')
}

export async function getWeather(request: Request) {
  const url = new URL(request.url)
  const lat = Number(url.searchParams.get('lat'))
  const lon = Number(url.searchParams.get('lon'))
  const unit = url.searchParams.get('unit')

  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) {
    throw new ApiError(400, 'INVALID_COORDINATES', '无效的经纬度参数。')
  }

  if (unit !== null && unit !== 'system' && unit !== 'c' && unit !== 'f') {
    throw new ApiError(400, 'INVALID_TEMPERATURE_UNIT', '无效的温度单位参数。')
  }

  const temperatureUnit = outputUnit(unit)
  const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast')
  forecastUrl.searchParams.set('latitude', lat.toString())
  forecastUrl.searchParams.set('longitude', lon.toString())
  forecastUrl.searchParams.set('current', 'temperature_2m,weather_code')
  forecastUrl.searchParams.set('temperature_unit', normalizeUnit(unit))

  const reverseUrl = new URL('https://geocoding-api.open-meteo.com/v1/reverse')
  reverseUrl.searchParams.set('latitude', lat.toString())
  reverseUrl.searchParams.set('longitude', lon.toString())
  reverseUrl.searchParams.set('language', 'zh')
  reverseUrl.searchParams.set('count', '1')

  const [forecastResponse, reverseResponse] = await Promise.all([
    fetch(forecastUrl.toString()),
    fetch(reverseUrl.toString()),
  ])

  if (!forecastResponse.ok) {
    throw new ApiError(502, 'WEATHER_PROVIDER_ERROR', '天气服务暂时不可用。')
  }

  const forecastJson: unknown = await forecastResponse.json()
  if (!forecastSchema.isForecastResponse(forecastJson)) {
    throw new ApiError(502, 'WEATHER_PROVIDER_INVALID_RESPONSE', '天气服务返回了无法识别的数据。')
  }

  let locationName: string | null = null
  if (reverseResponse.ok) {
    const reverseJson: unknown = await reverseResponse.json()
    if (reverseSchema.isReverseResponse(reverseJson)) {
      locationName = formatLocation(reverseJson.results?.[0])
    }
  }

  const mapped = getCondition(forecastJson.current.weather_code)

  return jsonSuccess({
    temperature: forecastJson.current.temperature_2m,
    unit: temperatureUnit,
    condition: mapped.condition,
    icon: mapped.icon,
    locationName,
    fetchedAt: forecastJson.current.time,
  })
}
