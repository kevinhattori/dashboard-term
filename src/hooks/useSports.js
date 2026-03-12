import { useState, useEffect, useCallback } from 'react'

const SPORT_MAP = {
  nfl: { sport: 'football', league: 'nfl' },
  nba: { sport: 'basketball', league: 'nba' },
  nhl: { sport: 'hockey', league: 'nhl' },
  mlb: { sport: 'baseball', league: 'mlb' }
}

function parseGames(events, primaryTeams) {
  return events.map(event => {
    const competitors = event.competitions?.[0]?.competitors || []
    const home = competitors.find(c => c.homeAway === 'home')
    const away = competitors.find(c => c.homeAway === 'away')
    const status = event.status?.type
    const isPrimary = primaryTeams.some(t =>
      competitors.some(c => c.team?.abbreviation === t.espn_id)
    )

    return {
      id: event.id,
      name: event.name,
      shortName: event.shortName,
      homeTeam: home?.team?.abbreviation || '???',
      awayTeam: away?.team?.abbreviation || '???',
      homeScore: home?.score || '0',
      awayScore: away?.score || '0',
      state: status?.state || 'pre',
      detail: status?.shortDetail || event.date,
      startTime: event.date,
      isPrimary
    }
  })
}

async function fetchNextGame(team) {
  const mapping = SPORT_MAP[team.league]
  if (!mapping) return null
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/${mapping.sport}/${mapping.league}/teams/${team.espn_id}/schedule`
    const res = await fetch(url)
    if (!res.ok) return null
    const json = await res.json()
    const now = new Date()
    const upcoming = (json.events || []).find(e => new Date(e.date) > now)
    if (!upcoming) return null
    const competitors = upcoming.competitions?.[0]?.competitors || []
    const home = competitors.find(c => c.homeAway === 'home')
    const away = competitors.find(c => c.homeAway === 'away')
    return {
      id: `next-${team.league}-${team.espn_id}`,
      name: upcoming.name,
      shortName: upcoming.shortName,
      homeTeam: home?.team?.abbreviation || '???',
      awayTeam: away?.team?.abbreviation || '???',
      homeScore: '0',
      awayScore: '0',
      state: 'pre',
      detail: upcoming.status?.type?.shortDetail || '',
      startTime: upcoming.date,
      isPrimary: true,
      isNextGame: true,
      league: team.league
    }
  } catch {
    return null
  }
}

export function useSports(config) {
  const [scores, setScores] = useState({})
  const [nextGames, setNextGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastFetched, setLastFetched] = useState(null)

  const fetchScores = useCallback(async () => {
    if (!config) return
    const results = {}

    try {
      const fetches = config.leagues.map(async (league) => {
        const mapping = SPORT_MAP[league]
        if (!mapping) return
        const url = `https://site.api.espn.com/apis/site/v2/sports/${mapping.sport}/${mapping.league}/scoreboard`
        const res = await fetch(url)
        if (!res.ok) return
        const json = await res.json()
        results[league] = parseGames(json.events || [], config.primary_teams)
      })

      await Promise.all(fetches)

      // For each primary team not in today's games, fetch next upcoming game
      const missingTeams = config.primary_teams.filter(team => {
        const games = results[team.league] || []
        return !games.some(g => g.isPrimary)
      })

      const nextGameResults = await Promise.all(missingTeams.map(fetchNextGame))
      setNextGames(nextGameResults.filter(Boolean))

      setScores(results)
      setLastFetched(new Date())
      localStorage.setItem('sports_cache', JSON.stringify({ data: results, time: Date.now() }))
      setError(null)
    } catch (err) {
      setError(err.message)
      const cached = localStorage.getItem('sports_cache')
      if (cached && Object.keys(scores).length === 0) {
        const { data: cachedData } = JSON.parse(cached)
        setScores(cachedData)
      }
    } finally {
      setLoading(false)
    }
  }, [config])

  useEffect(() => {
    fetchScores()
    const interval = setInterval(fetchScores, (config?.refresh_interval_minutes || 2) * 60000)
    return () => clearInterval(interval)
  }, [fetchScores])

  return { scores, nextGames, loading, error, lastFetched, refresh: fetchScores }
}
