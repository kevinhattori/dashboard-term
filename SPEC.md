# dashboard-term — Project Specification

## Overview

A locally-hosted, touch-optimized web dashboard designed for the Lenovo ThinkPad X1 Yoga
touchscreen. The interface combines a glassmorphism aesthetic with a terminal design language:
white monospace text, cyan cursor accents, scanline overlays, and animated data updates.

Four widget panels occupy the corners of the screen. The center of the screen serves as a
context panel — defaulting to a large terminal-style clock, and transforming into a detail view
when a widget is tapped.

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│  [WEATHER]              ↑↑↑              [SPORTS]   │
│                                                     │
│            ┌─────────────────────┐                  │
│            │                     │                  │
│            │   CENTER CONTEXT    │                  │
│            │      PANEL          │                  │
│            │                     │                  │
│            └─────────────────────┘                  │
│  [NEWS]                 ↓↓↓           [CALENDAR]   │
└─────────────────────────────────────────────────────┘
```

- **Top-left**: Weather widget
- **Top-right**: Sports widget
- **Bottom-left**: News / RSS widget
- **Bottom-right**: Google Calendar widget
- **Center**: Context panel (default: clock/date)

---

## Visual Design

### Theme
- **Style**: Glassmorphism + terminal aesthetic
- **Background**: User-swappable wallpaper (set via settings panel or file picker)
- **Panels**: Frosted glass effect using `backdrop-filter: blur()` and low-opacity backgrounds
- **Text**: White, monospace font (JetBrains Mono or Fira Code)
- **Accent color**: Cyan (`#00FFFF` or similar) for cursor, borders, highlights
- **Overlay**: Subtle scanline or noise texture over the full viewport

### Terminal Effects
- Blinking cyan cursor (`▋`) on active/updating elements
- Typing animation for text that updates (weather data refresh, scores, etc.)
- Boot sequence loading animation on initial page load (widgets "boot up" one by one)
- Subtle CRT flicker or vignette optional (toggleable in settings)

### Panel Styling (each widget + center)
```css
background: rgba(255, 255, 255, 0.06);
backdrop-filter: blur(14px);
border: 1px solid rgba(255, 255, 255, 0.12);
border-radius: 12px;
color: #ffffff;
font-family: 'JetBrains Mono', monospace;
```

---

## Center Context Panel

### Default State (nothing selected)
- Large terminal-style clock: `HH:MM:SS` with blinking cursor
- Date below in format: `THU 05 MAR 2026`
- Subtle "system ready" or hostname line at bottom

### Active States
Tapping any widget corner panel loads its detail view into the center. Tapping the center
panel itself (or an X/close) returns to the default clock view.

---

## Widgets

---

### 1. Weather (Top-Left)

**Collapsed View**
- Current temperature (°F)
- Feels like
- Humidity %
- Wind speed + direction
- Condition label (e.g., `PARTLY CLOUDY`)
- Small condition icon (ASCII or minimal SVG)

**Center Detail View (on tap)**
- Hourly forecast: scrollable row (next 24 hours)
  - Time, temp, condition, precipitation chance
- Extended info: UV index, visibility, pressure, sunrise/sunset
- Location label

**API**: [Open-Meteo](https://open-meteo.com/)
- No API key required
- Pass latitude/longitude in config
- Endpoint: `https://api.open-meteo.com/v1/forecast`

**Config**
```json
{
  "weather": {
    "latitude": 44.9778,
    "longitude": -93.2650,
    "location_label": "Minneapolis, MN",
    "units": "fahrenheit",
    "refresh_interval_minutes": 15
  }
}
```

---

### 2. Sports (Top-Right)

**Collapsed View**
- Show today's games or most recent scores for primary teams:
  - Minnesota Timberwolves (NBA)
  - Minnesota Wild (NHL)
  - Minnesota Vikings (NFL)
- Format per game: `TEAM vs TEAM — SCORE` or `UPCOMING HH:MM`
- If no games today, show next scheduled game

**Center Detail View (on tap)**
- Tab bar to switch between leagues: `NFL | NBA | MLB | NHL`
- Default tab: league of tapped game
- Shows all games for selected league today / this week
- Live scores update on a polling interval

**API**: ESPN unofficial API or TheSportsDB
- ESPN: `https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/scoreboard`
- No API key required for ESPN unofficial endpoints
- TheSportsDB: free tier available at `https://www.thesportsdb.com/api.php`

**Config**
```json
{
  "sports": {
    "primary_teams": [
      { "name": "Timberwolves", "league": "nba", "espn_id": "MIN" },
      { "name": "Wild",         "league": "nhl", "espn_id": "MIN" },
      { "name": "Vikings",      "league": "nfl", "espn_id": "MIN" }
    ],
    "leagues": ["nfl", "nba", "mlb", "nhl"],
    "refresh_interval_minutes": 2
  }
}
```

---

### 3. News / RSS (Bottom-Left)

**Collapsed View**
- Scrollable list of 5–8 headlines
- Source label prefix: `[REUTERS]`, `[HN]`, `[BLOOMBERG]`
- Auto-scrolls slowly (marquee-style or auto-scroll), pauses on hover/touch

**Center Detail View (on tap)**
- Tapping a headline loads the article into the center panel
- Article rendered as clean readable text (strip ads/nav via RSS `<content>` or `<description>`)
- Source, author, publish date shown in terminal header style
- Navigation: `← PREV` / `NEXT →` between headlines

**Feed Categories**
- **Tech**: Hacker News, The Verge, Ars Technica
- **General**: Reuters, BBC News, AP News
- **Financial**: Bloomberg (RSS), MarketWatch, WSJ (free RSS)

**Config** (user-editable feed list)
```json
{
  "news": {
    "feeds": [
      { "label": "HN",         "url": "https://news.ycombinator.com/rss", "category": "tech" },
      { "label": "THE VERGE",  "url": "https://www.theverge.com/rss/index.xml", "category": "tech" },
      { "label": "REUTERS",    "url": "https://feeds.reuters.com/reuters/topNews", "category": "general" },
      { "label": "BBC",        "url": "http://feeds.bbci.co.uk/news/rss.xml", "category": "general" },
      { "label": "MARKETWATCH","url": "https://feeds.marketwatch.com/marketwatch/topstories", "category": "finance" }
    ],
    "max_headlines": 30,
    "refresh_interval_minutes": 10
  }
}
```

**Note**: RSS fetching will require a small local proxy server (Node/Express) to avoid CORS
issues when fetching third-party RSS feeds from the browser.

---

### 4. Google Calendar (Bottom-Right)

**Collapsed View**
- Next 3–5 upcoming events
- Format: `MON 09 MAR  14:00  Team Standup`
- "Nothing scheduled today" state

**Center Detail View (on tap)**
- Month or week view (toggleable)
- Tap an event for full details: title, time, location, description, attendees
- Terminal-styled grid layout

**API**: Google Calendar API v3
- Requires OAuth 2.0 authentication (one-time browser login flow)
- Scopes: `https://www.googleapis.com/auth/calendar.readonly`
- Credentials stored locally (never transmitted)

**Config**
```json
{
  "calendar": {
    "calendar_ids": ["primary"],
    "days_ahead": 30,
    "refresh_interval_minutes": 5
  }
}
```

---

## Settings Panel

Accessible via a small `⚙` or `[CFG]` button in a corner or via keyboard shortcut.

- **Wallpaper**: file picker or drag-and-drop image
- **Location**: lat/long for weather
- **RSS feeds**: add/remove/reorder feeds
- **Sports teams**: add/remove primary teams
- **CRT effects**: toggle scanlines, flicker
- **Font size**: scale for readability

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | React + Vite | Component-based, fast dev, great for state-driven UI |
| Styling | Plain CSS + CSS variables | Full control over glassmorphism + terminal effects |
| Fonts | JetBrains Mono (Google Fonts) | Clean terminal aesthetic |
| RSS proxy | Node.js + Express (local) | Bypass CORS on RSS feeds |
| Auth | Google OAuth via browser | Calendar API access |
| Deployment | Local only (`localhost`) | Runs on the X1 Yoga, full-screen in browser |

---

## File Structure (anticipated)

```
dashboard-term/
├── SPEC.md                  ← this file
├── README.md
├── vite.config.js
├── package.json
├── config.json              ← user config (feeds, teams, location, etc.)
├── public/
│   └── wallpapers/          ← default wallpaper images
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── components/
│   │   ├── WeatherWidget.jsx
│   │   ├── SportsWidget.jsx
│   │   ├── NewsWidget.jsx
│   │   ├── CalendarWidget.jsx
│   │   ├── CenterPanel.jsx
│   │   ├── ClockDefault.jsx
│   │   └── SettingsPanel.jsx
│   ├── hooks/
│   │   ├── useWeather.js
│   │   ├── useSports.js
│   │   ├── useNews.js
│   │   └── useCalendar.js
│   └── styles/
│       ├── glass.css        ← glassmorphism variables + mixins
│       ├── terminal.css     ← fonts, cursor, scanlines, animations
│       └── widgets.css
└── proxy/
    ├── server.js            ← Node/Express RSS proxy
    └── package.json
```

---

## Running Locally

The app consists of two processes that run together:

| Process | Command | URL |
|---------|---------|-----|
| React dashboard (Vite) | `vite` | `http://localhost:5173` |
| RSS proxy (Node/Express) | `node proxy/server.js` | `http://localhost:3001` |

Both are started with a single command using `concurrently`:
```bash
npm run dev
```

This is configured in the root `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"vite\" \"node proxy/server.js\""
  }
}
```

Open `http://localhost:5173` in the browser after running. For a full-screen kiosk-style
experience, open in a Chromium-based browser and use **F11** or kiosk mode.

**Optional**: Add to system startup (systemd service or login script) so the dashboard
launches automatically when the laptop boots.

---

## Boot Animation

Plays silently on initial page load. Widgets initialize one by one with terminal-style
status lines in the center panel before transitioning to the clock default:

```
dashboard-term v0.1
───────────────────────────────
[  OK  ] loading config...
[  OK  ] connecting weather api...
[  OK  ] fetching sports scores...
[  OK  ] loading rss feeds...
[  OK  ] authenticating calendar...
[  OK  ] all systems nominal.

> ready_
```

Each line types in sequentially. On completion, the center panel fades to the clock view
and the corner widgets animate in. No sound.

---

## Offline / API Failure Behavior

- Widgets display the last successfully fetched data (cached in `localStorage`)
- A subtle indicator shows the cache age: `[CACHED 14m ago]` in the widget header
- A manual refresh button (`↺ REFRESH`) appears in the widget when cached data is being shown
- On reconnection, data refreshes automatically on the next poll interval

---

## Open Questions / Decisions Deferred

- [ ] Should the app support multiple Google accounts or just one?
- [ ] Default wallpaper — user will select; provide a file picker in settings
- [ ] Mobile/tablet layout or strictly desktop/landscape only?

---

*Spec version: 0.2 — boot, offline, and local dev decisions confirmed*
