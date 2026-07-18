import { useState, useEffect } from 'react'

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function formatTZ(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-AU', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone
  }).formatToParts(date)
  const get = type => parts.find(p => p.type === type)?.value ?? ''
  const h = get('hour').padStart(2, '0')
  const m = get('minute').padStart(2, '0')
  const s = get('second').padStart(2, '0')
  const ampm = get('dayPeriod').toUpperCase()
  return { time: `${h}:${m}:${s}`, ampm }
}

export default function ClockDefault() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const h24 = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const h12 = now.getHours() % 12 || 12
  const ampm = now.getHours() < 12 ? 'AM' : 'PM'
  const day = DAYS[now.getDay()]
  const date = String(now.getDate()).padStart(2, '0')
  const month = MONTHS[now.getMonth()]
  const year = now.getFullYear()

  const utc = formatTZ(now, 'UTC')
  const syd = formatTZ(now, 'Australia/Sydney')

  return (
    <div className="clock-display">
      <div className="clock-tz clock-tz-left">
        <div className="clock-tz-label">UTC</div>
        <div className="clock-tz-time">{utc.time} <span className="clock-tz-ampm">{utc.ampm}</span></div>
      </div>
      <div className="clock-tz clock-tz-right">
        <div className="clock-tz-label">SYDNEY</div>
        <div className="clock-tz-time">{syd.time} <span className="clock-tz-ampm">{syd.ampm}</span></div>
      </div>
      <div className="clock-time">
        {h24}:{minutes}:{seconds}<span className="cursor">▋</span>
      </div>
      <div className="clock-standard">
        {h12}:{minutes} {ampm}
      </div>
      <div className="clock-date">
        {day} {date} {month} {year}
      </div>
      <div className="clock-status">
        system ready — all nominal
      </div>
    </div>
  )
}
