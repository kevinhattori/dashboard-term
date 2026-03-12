import { useState, useEffect } from 'react'

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

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

  return (
    <div className="clock-display">
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
