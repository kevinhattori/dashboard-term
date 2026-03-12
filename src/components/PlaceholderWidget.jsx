import '../styles/widgets.css'

export default function PlaceholderWidget() {
  return (
    <div className="glass-panel placeholder-widget">
      <div className="placeholder-icon">⬡</div>
      <div>MODULE PENDING</div>
      <div style={{ fontSize: 10, marginTop: 4, color: 'var(--cyan-dim)' }}>slot available</div>
    </div>
  )
}
