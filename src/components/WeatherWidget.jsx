import '../styles/widgets.css'
import WeatherIcon, { WeatherIconSmall } from './WeatherIcon.jsx'

function CacheIndicator({ lastFetched }) {
  if (!lastFetched) return null
  const ago = Math.round((Date.now() - lastFetched.getTime()) / 60000)
  if (ago < 2) return null
  return <span className="cache-indicator">[CACHED {ago}m ago]</span>
}

export function WeatherCollapsed({ data, loading, error, lastFetched, refresh }) {
  if (loading && !data) return <div className="glass-panel weather-widget"><span className="cursor">▋</span> loading weather...</div>

  if (!data) return (
    <div className="glass-panel weather-widget">
      <div className="panel-header">WEATHER <span className="cache-indicator">ERR</span></div>
      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{error || 'No data'}</div>
      <button className="refresh-btn" onClick={refresh}>↺ REFRESH</button>
    </div>
  )

  return (
    <div className="glass-panel weather-widget">
      <div className="panel-header">
        WEATHER
        <CacheIndicator lastFetched={lastFetched} />
      </div>
      <div className="weather-main-row">
        <WeatherIcon code={data.weatherCode} />
        <div className="weather-main-info">
          <div className="temp-main">{data.temp}{data.unit}</div>
          <div className="temp-feels">feels like {data.feelsLike}{data.unit}</div>
        </div>
      </div>
      <div className="condition">{data.condition}</div>
      {data.daily && (
        <div className="five-day">
          {data.daily.time.map((day, i) => {
            const d = new Date(day + 'T00:00')
            const label = i === 0 ? 'TODAY' : ['SUN','MON','TUE','WED','THU','FRI','SAT'][d.getDay()]
            return (
              <div key={day} className="five-day-item">
                <div className="five-day-label">{label}</div>
                <WeatherIconSmall code={data.daily.weatherCode[i]} size={72} />
                <div className="five-day-temps">
                  <span className="five-day-hi">{Math.round(data.daily.high[i])}°</span>
                  <span className="five-day-lo">{Math.round(data.daily.low[i])}°</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <div className="stats">
        <div><span className="stat-label">HUMIDITY </span>{data.humidity}%</div>
        <div><span className="stat-label">WIND </span>{data.windSpeed} mph {data.windDir}</div>
      </div>
    </div>
  )
}

export function WeatherDetail({ data, config }) {
  if (!data) return <div>No weather data.</div>

  const formatHour = (iso) => {
    const d = new Date(iso)
    const h = d.getHours()
    return h === 0 ? '12AM' : h < 12 ? `${h}AM` : h === 12 ? '12PM' : `${h - 12}PM`
  }

  const formatTime = (iso) => {
    const d = new Date(iso)
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="weather-detail">
      <div className="panel-header">{config?.location_label || 'WEATHER'} — FORECAST</div>

      <div className="hourly-columns">
        <div className="hourly-col">
          {data.hourly.time.slice(0, 12).map((t, i) => (
            <div key={t} className="hourly-item">
              <div style={{ minWidth: 42 }}>{formatHour(t)}</div>
              <WeatherIconSmall code={data.hourly.weatherCode[i]} size={60} />
              <div className="hour-temp" style={{ minWidth: 42 }}>{Math.round(data.hourly.temperature[i])}{data.unit}</div>
              <div className="hour-precip">{data.hourly.precipProb[i]}%</div>
            </div>
          ))}
        </div>
        <div className="hourly-col">
          {data.hourly.time.slice(12, 24).map((t, i) => (
            <div key={t} className="hourly-item">
              <div style={{ minWidth: 42 }}>{formatHour(t)}</div>
              <WeatherIconSmall code={data.hourly.weatherCode[i + 12]} size={60} />
              <div className="hour-temp" style={{ minWidth: 42 }}>{Math.round(data.hourly.temperature[i + 12])}{data.unit}</div>
              <div className="hour-precip">{data.hourly.precipProb[i + 12]}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="extended-info">
        <div><span className="info-label">UV INDEX </span>{data.uvIndex}</div>
        <div><span className="info-label">SUNRISE </span>{formatTime(data.sunrise)}</div>
        <div><span className="info-label">SUNSET </span>{formatTime(data.sunset)}</div>
      </div>
    </div>
  )
}
