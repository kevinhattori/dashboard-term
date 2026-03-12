const ICON_SIZE = 144
const S = { stroke: '#ffffff', strokeWidth: 2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
const F = { fill: '#ffffff', stroke: 'none' }

function Sun() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="10" {...S} />
      <line x1="32" y1="8" x2="32" y2="14" {...S} />
      <line x1="32" y1="50" x2="32" y2="56" {...S} />
      <line x1="8" y1="32" x2="14" y2="32" {...S} />
      <line x1="50" y1="32" x2="56" y2="32" {...S} />
      <line x1="15" y1="15" x2="19.2" y2="19.2" {...S} />
      <line x1="44.8" y1="44.8" x2="49" y2="49" {...S} />
      <line x1="49" y1="15" x2="44.8" y2="19.2" {...S} />
      <line x1="19.2" y1="44.8" x2="15" y2="49" {...S} />
    </svg>
  )
}

function PartlyCloudy() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 64 64">
      <circle cx="40" cy="20" r="8" {...S} />
      <line x1="40" y1="6" x2="40" y2="9" {...S} />
      <line x1="52" y1="14" x2="54" y2="12" {...S} />
      <line x1="54" y1="20" x2="51" y2="20" {...S} />
      <line x1="28" y1="14" x2="26" y2="12" {...S} />
      <path d="M16 44 Q16 36 24 34 Q26 28 34 28 Q42 28 44 34 Q50 36 50 42 Q50 46 46 46 L20 46 Q16 46 16 44Z" {...S} />
    </svg>
  )
}

function Cloudy() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 64 64">
      <path d="M12 42 Q12 34 20 32 Q22 26 30 26 Q38 26 40 32 Q46 34 46 40 Q46 44 42 44 L16 44 Q12 44 12 42Z" {...S} />
      <path d="M24 26 Q26 20 34 20 Q42 20 44 26 Q50 28 50 34 Q50 36 48 37" {...S} />
    </svg>
  )
}

function Overcast() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 64 64">
      <path d="M10 40 Q10 32 18 30 Q20 24 28 24 Q36 24 38 30 Q44 32 44 38 Q44 42 40 42 L14 42 Q10 42 10 40Z" {...S} />
      <path d="M22 24 Q24 18 32 18 Q40 18 42 24 Q48 26 48 32 Q48 34 46 35" {...S} />
      <path d="M34 18 Q36 14 42 14 Q48 14 49 18 Q53 20 53 24 Q53 26 51 27" {...S} />
    </svg>
  )
}

function Fog() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 64 64">
      <line x1="12" y1="24" x2="52" y2="24" {...S} />
      <line x1="16" y1="32" x2="48" y2="32" {...S} />
      <line x1="12" y1="40" x2="52" y2="40" {...S} />
      <line x1="18" y1="48" x2="46" y2="48" {...S} />
    </svg>
  )
}

function Rain() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 64 64">
      <path d="M14 34 Q14 26 22 24 Q24 18 32 18 Q40 18 42 24 Q48 26 48 32 Q48 36 44 36 L18 36 Q14 36 14 34Z" {...S} />
      <line x1="22" y1="42" x2="20" y2="50" {...S} />
      <line x1="32" y1="42" x2="30" y2="50" {...S} />
      <line x1="42" y1="42" x2="40" y2="50" {...S} />
    </svg>
  )
}

function HeavyRain() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 64 64">
      <path d="M14 32 Q14 24 22 22 Q24 16 32 16 Q40 16 42 22 Q48 24 48 30 Q48 34 44 34 L18 34 Q14 34 14 32Z" {...S} />
      <line x1="18" y1="40" x2="16" y2="48" {...S} />
      <line x1="26" y1="40" x2="24" y2="48" {...S} />
      <line x1="34" y1="40" x2="32" y2="48" {...S} />
      <line x1="42" y1="40" x2="40" y2="48" {...S} />
      <line x1="22" y1="50" x2="20" y2="56" {...S} />
      <line x1="38" y1="50" x2="36" y2="56" {...S} />
    </svg>
  )
}

function Snow() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 64 64">
      <path d="M14 32 Q14 24 22 22 Q24 16 32 16 Q40 16 42 22 Q48 24 48 30 Q48 34 44 34 L18 34 Q14 34 14 32Z" {...S} />
      <circle cx="22" cy="44" r="2" {...F} />
      <circle cx="32" cy="42" r="2" {...F} />
      <circle cx="42" cy="44" r="2" {...F} />
      <circle cx="27" cy="52" r="2" {...F} />
      <circle cx="37" cy="52" r="2" {...F} />
    </svg>
  )
}

function Drizzle() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 64 64">
      <path d="M14 34 Q14 26 22 24 Q24 18 32 18 Q40 18 42 24 Q48 26 48 32 Q48 36 44 36 L18 36 Q14 36 14 34Z" {...S} />
      <line x1="24" y1="43" x2="23" y2="47" {...S} />
      <line x1="34" y1="43" x2="33" y2="47" {...S} />
      <line x1="44" y1="43" x2="43" y2="47" {...S} />
    </svg>
  )
}

function Thunderstorm() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 64 64">
      <path d="M14 30 Q14 22 22 20 Q24 14 32 14 Q40 14 42 20 Q48 22 48 28 Q48 32 44 32 L18 32 Q14 32 14 30Z" {...S} />
      <polyline points="30,36 26,46 34,46 28,56" {...S} strokeWidth="2.5" />
      <line x1="40" y1="38" x2="38" y2="46" {...S} />
    </svg>
  )
}

function FreezingRain() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 64 64">
      <path d="M14 32 Q14 24 22 22 Q24 16 32 16 Q40 16 42 22 Q48 24 48 30 Q48 34 44 34 L18 34 Q14 34 14 32Z" {...S} />
      <line x1="22" y1="40" x2="20" y2="48" {...S} />
      <line x1="32" y1="40" x2="30" y2="48" {...S} />
      <line x1="42" y1="40" x2="40" y2="48" {...S} />
      <line x1="18" y1="46" x2="22" y2="42" {...S} strokeWidth="1" />
      <line x1="28" y1="46" x2="32" y2="42" {...S} strokeWidth="1" />
    </svg>
  )
}

function Unknown() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="18" {...S} />
      <text x="32" y="38" textAnchor="middle" fill="#ffffff" fontSize="18" fontFamily="monospace">?</text>
    </svg>
  )
}

// WMO weather code to icon mapping
const CODE_MAP = {
  0: Sun,             // Clear sky
  1: Sun,             // Mainly clear
  2: PartlyCloudy,    // Partly cloudy
  3: Overcast,        // Overcast
  45: Fog,            // Fog
  48: Fog,            // Rime fog
  51: Drizzle,        // Light drizzle
  53: Drizzle,        // Drizzle
  55: Drizzle,        // Heavy drizzle
  61: Rain,           // Light rain
  63: Rain,           // Rain
  65: HeavyRain,      // Heavy rain
  66: FreezingRain,   // Freezing rain
  67: FreezingRain,   // Heavy freezing rain
  71: Snow,           // Light snow
  73: Snow,           // Snow
  75: Snow,           // Heavy snow
  77: Snow,           // Snow grains
  80: Rain,           // Light showers
  81: Rain,           // Showers
  82: HeavyRain,      // Heavy showers
  85: Snow,           // Light snow showers
  86: Snow,           // Heavy snow showers
  95: Thunderstorm,   // Thunderstorm
  96: Thunderstorm,   // Thunderstorm w/ hail
  99: Thunderstorm,   // Thunderstorm w/ heavy hail
}

export default function WeatherIcon({ code }) {
  const IconComponent = CODE_MAP[code] || Unknown
  return <IconComponent />
}

export function WeatherIconSmall({ code, size = 32 }) {
  const IconComponent = CODE_MAP[code] || Unknown
  const scale = size / ICON_SIZE
  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'center', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent />
    </div>
  )
}
