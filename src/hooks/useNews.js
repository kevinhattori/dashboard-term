import { useState, useEffect, useCallback } from 'react'

function parseXML(xmlText) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlText, 'application/xml')

  // Handle both RSS and Atom feeds
  const isAtom = doc.querySelector('feed')
  const items = isAtom
    ? doc.querySelectorAll('entry')
    : doc.querySelectorAll('item')

  return Array.from(items).map(item => {
    if (isAtom) {
      return {
        title: item.querySelector('title')?.textContent || '',
        link: item.querySelector('link')?.getAttribute('href') || '',
        description: item.querySelector('summary')?.textContent || item.querySelector('content')?.textContent || '',
        pubDate: item.querySelector('updated')?.textContent || item.querySelector('published')?.textContent || ''
      }
    }
    return {
      title: item.querySelector('title')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      description: item.querySelector('description')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent || ''
    }
  })
}

function stripHTML(html) {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || ''
}

export function useNews(config) {
  const [headlines, setHeadlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastFetched, setLastFetched] = useState(null)

  const fetchNews = useCallback(async () => {
    if (!config?.feeds?.length) return

    try {
      const allHeadlines = []

      const fetches = config.feeds.map(async (feed) => {
        try {
          const res = await fetch(`/api/rss?url=${encodeURIComponent(feed.url)}`)
          if (!res.ok) return
          const xml = await res.text()
          const items = parseXML(xml)
          items.forEach(item => {
            allHeadlines.push({
              ...item,
              description: stripHTML(item.description),
              source: feed.label,
              category: feed.category
            })
          })
        } catch {
          // Skip failed feeds silently
        }
      })

      await Promise.all(fetches)

      // Sort by date (newest first), limit
      allHeadlines.sort((a, b) => {
        const da = a.pubDate ? new Date(a.pubDate) : 0
        const db = b.pubDate ? new Date(b.pubDate) : 0
        return db - da
      })

      const limited = allHeadlines.slice(0, config.max_headlines || 30)
      setHeadlines(limited)
      setLastFetched(new Date())
      localStorage.setItem('news_cache', JSON.stringify({ data: limited, time: Date.now() }))
      setError(null)
    } catch (err) {
      setError(err.message)
      const cached = localStorage.getItem('news_cache')
      if (cached && headlines.length === 0) {
        const { data: cachedData } = JSON.parse(cached)
        setHeadlines(cachedData)
      }
    } finally {
      setLoading(false)
    }
  }, [config])

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, (config?.refresh_interval_minutes || 10) * 60000)
    return () => clearInterval(interval)
  }, [fetchNews])

  return { headlines, loading, error, lastFetched, refresh: fetchNews }
}
