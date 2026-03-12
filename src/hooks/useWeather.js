import { useState, useEffect, useCallback } from 'react'

const WMO_CODES = {
  0: 'CLEAR SKY', 1: 'MAINLY CLEAR', 2: 'PARTLY CLOUDY', 3: 'OVERCAST',
  45: 'FOG', 48: 'RIME FOG',
  51: 'LIGHT DRIZZLE', 53: 'DRIZZLE', 55: 'HEAVY DRIZZLE',
  61: 'LIGHT RAIN', 63: 'RAIN', 65: 'HEAVY RAIN',
  66: 'FREEZING RAIN', 67: 'HEAVY FREEZING RAIN',
  71: 'LIGHT SNOW', 73: 'SNOW', 75: 'HEAVY SNOW',
  77: 'SNOW GRAINS',
  80: 'LIGHT SHOWERS', 81: 'SHOWERS', 82: 'HEAVY SHOWERS',
  85: 'LIGHT SNOW SHOWERS', 86: 'HEAVY SNOW SHOWERS',
  95: 'THUNDERSTORM', 96: 'THUNDERSTORM W/ HAIL', 99: 'THUNDERSTORM W/ HEAVY HAIL'
}

const WIND_DIRECTIONS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']

function degToDir(deg) {
  return WIND_DIRECTIONS[Math.round(deg / 22.5) % 16]
}

export function useWeather(config) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastFetched, setLastFetched] = useState(null)

  const fetchWeather = useCallback(async () => {
    if (!config) return
    const { latitude, longitude } = config
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m` +
      `&hourly=temperature_2m,weather_code,precipitation_probability` +
      `&daily=sunrise,sunset,uv_index_max,temperature_2m_max,temperature_2m_min,weather_code` +
      `&temperature_unit=${config.units === 'fahrenheit' ? 'fahrenheit' : 'celsius'}` +
      `&wind_speed_unit=mph&timezone=auto&forecast_days=5&models=best_match`

    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Weather API ${res.status}`)
      const json = await res.json()

      const current = json.current
      const now = new Date()
      const currentHourIndex = json.hourly.time.findIndex(t => new Date(t) >= now)
      const hourlySlice = {
        time: json.hourly.time.slice(currentHourIndex, currentHourIndex + 24),
        temperature: json.hourly.temperature_2m.slice(currentHourIndex, currentHourIndex + 24),
        weatherCode: json.hourly.weather_code.slice(currentHourIndex, currentHourIndex + 24),
        precipProb: json.hourly.precipitation_probability.slice(currentHourIndex, currentHourIndex + 24)
      }

      const parsed = {
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        windDir: degToDir(current.wind_direction_10m),
        condition: WMO_CODES[current.weather_code] || 'UNKNOWN',
        weatherCode: current.weather_code,
        hourly: hourlySlice,
        sunrise: json.daily.sunrise[0],
        sunset: json.daily.sunset[0],
        uvIndex: json.daily.uv_index_max[0],
        daily: {
          time: json.daily.time,
          high: json.daily.temperature_2m_max,
          low: json.daily.temperature_2m_min,
          weatherCode: json.daily.weather_code
        },
        unit: config.units === 'fahrenheit' ? '°F' : '°C'
      }

      setData(parsed)
      setLastFetched(new Date())
      localStorage.setItem('weather_cache', JSON.stringify({ data: parsed, time: Date.now() }))
      setError(null)
    } catch (err) {
      setError(err.message)
      const cached = localStorage.getItem('weather_cache')
      if (cached && !data) {
        const { data: cachedData } = JSON.parse(cached)
        setData(cachedData)
      }
    } finally {
      setLoading(false)
    }
  }, [config])

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(fetchWeather, (config?.refresh_interval_minutes || 15) * 60000)
    return () => clearInterval(interval)
  }, [fetchWeather])

  return { data, loading, error, lastFetched, refresh: fetchWeather }
}
