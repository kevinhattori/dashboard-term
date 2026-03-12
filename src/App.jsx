import { useState, useCallback } from 'react'
import { useWeather } from './hooks/useWeather.js'
import { useSports } from './hooks/useSports.js'
import { useNews } from './hooks/useNews.js'
import { WeatherCollapsed, WeatherDetail } from './components/WeatherWidget.jsx'
import { SportsCollapsed, SportsDetail } from './components/SportsWidget.jsx'
import { NewsCollapsed, NewsDetail } from './components/NewsWidget.jsx'
import GlobeWidget from './components/GlobeWidget.jsx'
import CenterPanel from './components/CenterPanel.jsx'
import BootScreen from './components/BootScreen.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import defaultConfig from '../config.json'

export default function App() {
  const [config, setConfig] = useState(defaultConfig)
  const [activeWidget, setActiveWidget] = useState(null)
  const [newsArticleIndex, setNewsArticleIndex] = useState(0)
  const [wallpaper, setWallpaper] = useState('/wallpapers/macos-mojave-solar.jpg')
  const [booted, setBooted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const weather = useWeather(config.weather)
  const sports = useSports(config.sports)
  const news = useNews(config.news)

  const handleWidgetTap = (widget) => {
    setActiveWidget(prev => prev === widget ? null : widget)
  }

  const handleBootComplete = useCallback(() => setBooted(true), [])

  const renderDetail = () => {
    switch (activeWidget) {
      case 'weather':
        return <WeatherDetail data={weather.data} config={config.weather} />
      case 'sports':
        return <SportsDetail scores={sports.scores} config={config.sports} />
      case 'news':
        return <NewsDetail headlines={news.headlines} initialIndex={newsArticleIndex} />
      default:
        return null
    }
  }

  if (!booted) {
    return <BootScreen onComplete={handleBootComplete} />
  }

  return (
    <div
      className="dashboard scanlines"
      style={{
        background: wallpaper
          ? `url('${wallpaper}') center/cover no-repeat fixed`
          : 'var(--bg-dark)'
      }}
    >
      {/* Top-left: Weather */}
      <div
        className="widget-slot top-left widget-enter"
        style={{ animationDelay: '0.1s' }}
        onClick={() => handleWidgetTap('weather')}
      >
        <WeatherCollapsed
          data={weather.data}
          loading={weather.loading}
          error={weather.error}
          lastFetched={weather.lastFetched}
          refresh={weather.refresh}
        />
      </div>

      {/* Top-right: News */}
      <div
        className="widget-slot top-right widget-enter"
        style={{ animationDelay: '0.2s' }}
        onClick={() => handleWidgetTap('news')}
      >
        <NewsCollapsed
          headlines={news.headlines}
          loading={news.loading}
          lastFetched={news.lastFetched}
          onRefresh={news.refresh}
          onSelectArticle={(i) => {
            setNewsArticleIndex(i)
            setActiveWidget('news')
          }}
        />
      </div>

      {/* Center */}
      <CenterPanel
        activeWidget={activeWidget}
        onClose={() => setActiveWidget(null)}
      >
        {renderDetail()}
      </CenterPanel>

      {/* Bottom-left: Sports */}
      <div
        className="widget-slot bottom-left widget-enter"
        style={{ animationDelay: '0.3s' }}
        onClick={() => handleWidgetTap('sports')}
      >
        <SportsCollapsed
          scores={sports.scores}
          nextGames={sports.nextGames}
          loading={sports.loading}
          config={config.sports}
          lastFetched={sports.lastFetched}
        />
      </div>

      {/* Bottom-right: Globe */}
      <div
        className="widget-slot bottom-right widget-enter"
        style={{ animationDelay: '0.4s' }}
      >
        <GlobeWidget />
      </div>

      {/* Settings */}
      <button className="settings-toggle" onClick={() => setShowSettings(true)}>[CFG]</button>
      {showSettings && (
        <SettingsPanel
          config={config}
          onSave={setConfig}
          onClose={() => setShowSettings(false)}
          wallpaper={wallpaper}
          onWallpaperChange={setWallpaper}
        />
      )}
    </div>
  )
}
