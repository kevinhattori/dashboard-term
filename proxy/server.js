import express from 'express'
import cors from 'cors'
import { readdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'

const __dirname = dirname(fileURLToPath(import.meta.url))
const WALLPAPER_DIR = join(__dirname, '..', 'public', 'wallpapers')
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp']

const app = express()
const PORT = 3001

app.use(cors({ origin: 'http://localhost:5173' }))

app.get('/api/rss', async (req, res) => {
  const { url } = req.query
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' })
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'dashboard-term/0.1' }
    })
    if (!response.ok) {
      return res.status(response.status).json({ error: `Feed returned ${response.status}` })
    }
    const text = await response.text()
    res.set('Content-Type', 'application/xml')
    res.send(text)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/article', async (req, res) => {
  const { url } = req.query
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; dashboard-term/0.1)',
        'Accept': 'text/html'
      }
    })
    if (!response.ok) {
      return res.status(response.status).json({ error: `Article fetch returned ${response.status}` })
    }
    const html = await response.text()
    const dom = new JSDOM(html, { url })
    const reader = new Readability(dom.window.document)
    const article = reader.parse()

    if (!article) {
      return res.json({ error: 'Could not parse article', content: null })
    }

    // Convert HTML content to plain text
    const textDom = new JSDOM(article.content)
    const textContent = textDom.window.document.body.textContent || ''

    res.json({
      title: article.title,
      byline: article.byline,
      content: textContent.trim(),
      excerpt: article.excerpt,
      siteName: article.siteName,
      length: article.length
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/wallpapers', async (req, res) => {
  try {
    const files = await readdir(WALLPAPER_DIR)
    const images = files
      .filter(f => IMAGE_EXTS.some(ext => f.toLowerCase().endsWith(ext)))
      .sort()
      .map(f => ({
        label: f.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').toUpperCase(),
        value: `/wallpapers/${f}`
      }))
    res.json(images)
  } catch (err) {
    res.json([])
  }
})

app.listen(PORT, () => {
  console.log(`[proxy] RSS proxy running on http://localhost:${PORT}`)
})
