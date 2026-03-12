import '../styles/widgets.css'
import { useState, useEffect, useRef, useCallback } from 'react'

function CacheIndicator({ lastFetched }) {
  if (!lastFetched) return null
  const ago = Math.round((Date.now() - lastFetched.getTime()) / 60000)
  if (ago < 2) return null
  return <span className="cache-indicator">[CACHED {ago}m ago]</span>
}

export function NewsCollapsed({ headlines, loading, lastFetched, onSelectArticle, onRefresh }) {
  const listRef = useRef(null)
  const userPausedRef = useRef(false)
  const loopPausedRef = useRef(false)
  const animRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (!el || headlines.length === 0) return
    let delayTimer = null

    const scroll = () => {
      if (!userPausedRef.current && !loopPausedRef.current && el) {
        el.scrollTop += 0.5
        if (el.scrollTop >= el.scrollHeight - el.clientHeight) {
          el.scrollTop = 0
          loopPausedRef.current = true
          delayTimer = setTimeout(() => {
            loopPausedRef.current = false
          }, 3000)
        }
      }
      animRef.current = requestAnimationFrame(scroll)
    }

    animRef.current = requestAnimationFrame(scroll)
    return () => {
      cancelAnimationFrame(animRef.current)
      if (delayTimer) clearTimeout(delayTimer)
    }
  }, [headlines])

  const handlePause = useCallback(() => { userPausedRef.current = true }, [])
  const handleResume = useCallback(() => { userPausedRef.current = false }, [])

  if (loading && headlines.length === 0) {
    return <div className="glass-panel news-widget"><span className="cursor">▋</span> loading feeds...</div>
  }

  return (
    <div
      className="glass-panel news-widget"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onTouchStart={handlePause}
      onTouchEnd={handleResume}
    >
      <div className="panel-header">
        NEWS
        <span>
          <CacheIndicator lastFetched={lastFetched} />
          <button className="refresh-btn" onClick={(e) => { e.stopPropagation(); onRefresh() }}>↺</button>
        </span>
      </div>
      <div className="headline-list" ref={listRef}>
        {headlines.map((item, i) => (
          <div
            key={i}
            className="headline-item"
            onClick={(e) => { e.stopPropagation(); onSelectArticle(i) }}
          >
            <span className="source-tag">[{item.source}]</span>
            {item.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export function NewsDetail({ headlines, initialIndex = 0 }) {
  const [index, setIndex] = useState(initialIndex)
  const [fullArticle, setFullArticle] = useState(null)
  const [articleLoading, setArticleLoading] = useState(false)

  useEffect(() => {
    setIndex(initialIndex)
  }, [initialIndex])

  const article = headlines[index]

  useEffect(() => {
    setFullArticle(null)
    if (!article?.link) return

    setArticleLoading(true)
    fetch(`/api/article?url=${encodeURIComponent(article.link)}`)
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setFullArticle(data)
        }
      })
      .catch(() => {})
      .finally(() => setArticleLoading(false))
  }, [index, article?.link])

  if (!article) return <div>No articles loaded.</div>

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d)) return dateStr
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  }

  const bodyText = fullArticle?.content || article.description || 'No content available.'

  return (
    <div className="news-detail">
      <div className="article-header">
        <div className="article-source">
          [{article.source}]
          {fullArticle?.siteName && ` — ${fullArticle.siteName}`}
        </div>
        <div className="article-title">{fullArticle?.title || article.title}</div>
        <div className="article-date">
          {fullArticle?.byline && <span>{fullArticle.byline} — </span>}
          {formatDate(article.pubDate)}
        </div>
      </div>
      <div className="article-body">
        {articleLoading ? (
          <span><span className="cursor">▋</span> fetching article...</span>
        ) : (
          bodyText
        )}
      </div>
      {article.link && (
        <div style={{ marginTop: 12, fontSize: 10 }}>
          <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)' }}>
            → open source
          </a>
        </div>
      )}
      <div className="article-nav">
        <button disabled={index === 0} onClick={() => setIndex(i => i - 1)}>← PREV</button>
        <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{index + 1} / {headlines.length}</span>
        <button disabled={index >= headlines.length - 1} onClick={() => setIndex(i => i + 1)}>NEXT →</button>
      </div>
    </div>
  )
}
