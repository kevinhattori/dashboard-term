import '../styles/widgets.css'
import { useState, useEffect } from 'react'
import { WildLogo, TimberwolvesLogo, VikingsLogo } from './MNTeamLogos.jsx'

const LOGOS = [WildLogo, TimberwolvesLogo, VikingsLogo]

function CacheIndicator({ lastFetched }) {
  if (!lastFetched) return null
  const ago = Math.round((Date.now() - lastFetched.getTime()) / 60000)
  if (ago < 2) return null
  return <span className="cache-indicator">[CACHED {ago}m ago]</span>
}

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function formatGameLine(game) {
  if (game.isNextGame) {
    const d = new Date(game.startTime)
    const day = DAYS[d.getDay()]
    const mon = MONTHS[d.getMonth()]
    const date = d.getDate()
    const h = d.getHours()
    const m = String(d.getMinutes()).padStart(2, '0')
    const h12 = h % 12 || 12
    const ampm = h < 12 ? 'AM' : 'PM'
    return `${game.shortName} — ${day} ${mon} ${date} ${h12}:${m}${ampm}`
  }
  if (game.state === 'pre') {
    const d = new Date(game.startTime)
    const h = d.getHours()
    const m = String(d.getMinutes()).padStart(2, '0')
    const h12 = h % 12 || 12
    const ampm = h < 12 ? 'AM' : 'PM'
    return `${game.shortName} — ${h12}:${m}${ampm}`
  }
  if (game.state === 'post') {
    return `${game.awayTeam} ${game.awayScore} - ${game.homeTeam} ${game.homeScore} FINAL`
  }
  return `${game.awayTeam} ${game.awayScore} - ${game.homeTeam} ${game.homeScore}`
}

export function SportsCollapsed({ scores, nextGames = [], loading, config, lastFetched }) {
  const [logoIndex, setLogoIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoIndex(i => (i + 1) % LOGOS.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading && Object.keys(scores).length === 0) {
    return <div className="glass-panel sports-widget"><span className="cursor">▋</span> loading scores...</div>
  }

  // Gather primary team games across all leagues
  const primaryGames = []
  for (const league of config.leagues) {
    const games = scores[league] || []
    games.filter(g => g.isPrimary).forEach(g => primaryGames.push({ ...g, league }))
  }

  // Add next upcoming games for teams not playing today
  const allGames = [...primaryGames, ...nextGames.map(g => ({ ...g, league: g.league || '' }))]

  return (
    <div className="glass-panel sports-widget">
      <div className="panel-header">
        SCORES
        <CacheIndicator lastFetched={lastFetched} />
      </div>
      {allGames.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>No games scheduled</div>
      ) : (
        allGames.map(game => (
          <div key={game.id} className="game-item">
            <span className="league-tag">[{game.league.toUpperCase()}]</span>
            <span className={game.isNextGame ? 'game-upcoming' : 'game-score'}>{formatGameLine(game)}</span>
            {game.state === 'in' && <div className="game-status">{game.detail}</div>}
          </div>
        ))
      )}
      <div className="mn-logos">
        <div className="mn-logo-stage">
          {LOGOS.map((Logo, i) => (
            <Logo key={i} size={224} className={i === logoIndex ? 'mn-logo-visible' : 'mn-logo-hidden'} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SportsDetail({ scores, config }) {
  const [activeLeague, setActiveLeague] = useState(config.leagues[0])
  const games = scores[activeLeague] || []

  return (
    <div className="sports-detail">
      <div className="panel-header">SCOREBOARD</div>
      <div className="league-tabs">
        {config.leagues.map(league => (
          <button
            key={league}
            className={`league-tab ${activeLeague === league ? 'active' : ''}`}
            onClick={() => setActiveLeague(league)}
          >
            {league}
          </button>
        ))}
      </div>

      {games.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>No games scheduled</div>
      ) : (
        games.map(game => (
          <div key={game.id} className="scoreboard-item">
            <div className="teams">
              <div>{game.awayTeam} @ {game.homeTeam}</div>
            </div>
            {game.state !== 'pre' ? (
              <div className="score">{game.awayScore} - {game.homeScore}</div>
            ) : null}
            <div className="game-state">{game.detail}</div>
          </div>
        ))
      )}
    </div>
  )
}
