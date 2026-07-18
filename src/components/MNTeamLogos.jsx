const LOGOS = {
  wild:         'https://a.espncdn.com/i/teamlogos/nhl/500/min.png',
  timberwolves: 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
  vikings:      'https://a.espncdn.com/i/teamlogos/nfl/500/min.png',
  lynx:         'https://a.espncdn.com/i/teamlogos/wnba/500/min.png',
}

export function WildLogo({ size = 56, className = '' }) {
  return <img src={LOGOS.wild} width={size} height={size} className={`mn-logo ${className}`} alt="Minnesota Wild" />
}

export function TimberwolvesLogo({ size = 56, className = '' }) {
  return <img src={LOGOS.timberwolves} width={size} height={size} className={`mn-logo ${className}`} alt="Minnesota Timberwolves" />
}

export function VikingsLogo({ size = 56, className = '' }) {
  return <img src={LOGOS.vikings} width={size} height={size} className={`mn-logo ${className}`} alt="Minnesota Vikings" />
}

export function LynxLogo({ size = 56, className = '' }) {
  return <img src={LOGOS.lynx} width={size} height={size} className={`mn-logo ${className}`} alt="Minnesota Lynx" />
}
