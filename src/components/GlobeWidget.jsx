import { useRef, useEffect, useState } from 'react'
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo'
import { feature } from 'topojson-client'
import '../styles/widgets.css'

const CODE_LINES = [
  '$ ssh root@10.0.1.42',
  'connected to gateway-node-07',
  '> systemctl status dashboard',
  '● dashboard.service - active (running)',
  '  loaded: /etc/systemd/system/dashboard.service',
  '  PID: 3847 (node)',
  '  memory: 42.1M',
  '  uptime: 14d 7h 23m',
  '> cat /var/log/sysmon.log | tail',
  '[2026-03-08 01:14:22] CPU: 12% MEM: 4.2G/16G',
  '[2026-03-08 01:14:23] NET: rx 14.2MB tx 3.1MB',
  '[2026-03-08 01:14:24] DISK: 128G/512G (25%)',
  '[2026-03-08 01:14:25] PROC: 142 running 3 sleeping',
  '[2026-03-08 01:14:26] TEMP: CPU 52°C GPU 41°C',
  '> nmap -sP 10.0.1.0/24',
  'scanning 256 hosts...',
  '10.0.1.1    gateway    UP  2ms',
  '10.0.1.12   nas-alpha  UP  4ms',
  '10.0.1.15   printer    UP  8ms',
  '10.0.1.42   this-host  UP  <1ms',
  '10.0.1.50   media-srv  UP  3ms',
  '> openssl rand -hex 32',
  'a4f8c2e91b3d07f6e5a829c4d1b7f3e2...',
  '> curl -s https://api.sys/health',
  '{ "status": "ok", "nodes": 7 }',
  '> df -h',
  'Filesystem  Size  Used  Avail  Use%',
  '/dev/sda1   512G  128G  384G   25%',
  '/dev/sdb1   2.0T  1.1T  0.9T   55%',
  'tmpfs       8.0G  412M  7.6G    5%',
  '> docker ps --format "{{.Names}}"',
  'proxy-nginx',
  'dashboard-app',
  'redis-cache',
  'postgres-main',
  'grafana-monitor',
  '> git log --oneline -5',
  'f3a21c8 update feed parser config',
  'b17e4d2 fix timezone offset bug',
  'a892cf1 add weather cache layer',
  '7c3b0e9 refactor sports hook',
  '1e5d4a3 initial dashboard build',
  '> uptime',
  '01:14:30 up 14 days, 7:23, 1 user',
  'load average: 0.42, 0.38, 0.35',
  '> ping -c 3 8.8.8.8',
  '64 bytes from 8.8.8.8: time=12.4ms',
  '64 bytes from 8.8.8.8: time=11.8ms',
  '64 bytes from 8.8.8.8: time=12.1ms',
  '> _',
]

export default function GlobeWidget() {
  const canvasRef = useRef(null)
  const rotationRef = useRef(0)
  const worldRef = useRef(null)
  const scrollRef = useRef(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    import('world-atlas/land-110m.json').then(topology => {
      worldRef.current = feature(topology, topology.objects.land)
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (!loaded) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const lineHeight = 16
    const totalHeight = CODE_LINES.length * lineHeight

    const render = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      ctx.clearRect(0, 0, width, height)

      // Scrolling code background
      ctx.font = '11px "JetBrains Mono", monospace'
      scrollRef.current += 0.3
      if (scrollRef.current > totalHeight) scrollRef.current = 0

      for (let pass = -1; pass <= 1; pass++) {
        const offsetY = -scrollRef.current + pass * totalHeight
        for (let i = 0; i < CODE_LINES.length; i++) {
          const y = offsetY + i * lineHeight
          if (y < -lineHeight || y > height + lineHeight) continue

          const line = CODE_LINES[i]
          if (line.startsWith('$') || line.startsWith('>')) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.12)'
          } else if (line.startsWith('[')) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.07)'
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
          }
          ctx.fillText(line, 8, y)
        }
      }

      // Globe
      const radius = Math.min(width, height) * 0.42

      const projection = geoOrthographic()
        .scale(radius)
        .translate([width / 2, height / 2])
        .rotate([rotationRef.current, -20])

      const path = geoPath(projection, ctx)
      const graticule = geoGraticule10()

      // Globe outline
      ctx.beginPath()
      path({ type: 'Sphere' })
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Graticule
      ctx.beginPath()
      path(graticule)
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Land outlines
      ctx.beginPath()
      path(worldRef.current)
      ctx.strokeStyle = '#00ffff'
      ctx.lineWidth = 1.2
      ctx.stroke()

      // Land fill
      ctx.beginPath()
      path(worldRef.current)
      ctx.fillStyle = 'rgba(0, 255, 255, 0.06)'
      ctx.fill()

      rotationRef.current += 0.15
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [loaded])

  return (
    <div className="glass-panel globe-widget">
      <div className="panel-header">EARTH</div>
      <canvas ref={canvasRef} className="globe-canvas" />
    </div>
  )
}
