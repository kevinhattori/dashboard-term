import { useState, useEffect } from 'react'

const BOOT_LINES = [
  { text: 'dashboard-term v0.1', delay: 0 },
  { text: '───────────────────────────────', delay: 200 },
  { text: '[  OK  ] loading config...', delay: 500 },
  { text: '[  OK  ] connecting weather api...', delay: 900 },
  { text: '[  OK  ] fetching sports scores...', delay: 1300 },
  { text: '[  OK  ] loading rss feeds...', delay: 1700 },
  { text: '[  OK  ] all systems nominal.', delay: 2200 },
  { text: '', delay: 2500 },
  { text: '> ready_', delay: 2700 }
]

export default function BootScreen({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    )

    const fadeTimer = setTimeout(() => setFading(true), 3200)
    const doneTimer = setTimeout(() => onComplete(), 3800)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  return (
    <div className={`boot-screen ${fading ? 'fading' : ''}`}>
      <div className="boot-content">
        {BOOT_LINES.map((line, i) => (
          <div
            key={i}
            className={`boot-line ${i < visibleLines ? 'visible' : ''}`}
          >
            {line.text.startsWith('[') ? (
              <>
                <span className="boot-ok">[  OK  ]</span>
                {line.text.substring(8)}
              </>
            ) : line.text.startsWith('>') ? (
              <span style={{ color: 'var(--cyan)' }}>{line.text}<span className="cursor">▋</span></span>
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
