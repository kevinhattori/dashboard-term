import { useState, useEffect } from 'react'

export default function SettingsPanel({ config, onSave, onClose, wallpaper, onWallpaperChange }) {
  const [lat, setLat] = useState(String(config.weather.latitude))
  const [lng, setLng] = useState(String(config.weather.longitude))
  const [locationLabel, setLocationLabel] = useState(config.weather.location_label)
  const [scanlines, setScanlines] = useState(true)
  const [wallpapers, setWallpapers] = useState([])

  useEffect(() => {
    fetch('/api/wallpapers')
      .then(res => res.json())
      .then(list => setWallpapers([{ label: 'NONE', value: '' }, ...list]))
      .catch(() => setWallpapers([{ label: 'NONE', value: '' }]))
  }, [])

  const handleSave = () => {
    const updated = {
      ...config,
      weather: {
        ...config.weather,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        location_label: locationLabel
      }
    }
    onSave(updated)
    onClose()
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="glass-panel settings-panel" onClick={e => e.stopPropagation()}>
        <h2>// config</h2>

        <div className="setting-group">
          <label>Wallpaper</label>
          <select
            value={wallpaper || ''}
            onChange={(e) => onWallpaperChange(e.target.value)}
          >
            {wallpapers.map(wp => (
              <option key={wp.value} value={wp.value}>{wp.label}</option>
            ))}
          </select>
        </div>

        <div className="setting-group">
          <label>Location Label</label>
          <input value={locationLabel} onChange={e => setLocationLabel(e.target.value)} />
        </div>

        <div className="setting-group">
          <label>Latitude</label>
          <input type="number" step="0.0001" value={lat} onChange={e => setLat(e.target.value)} />
        </div>

        <div className="setting-group">
          <label>Longitude</label>
          <input type="number" step="0.0001" value={lng} onChange={e => setLng(e.target.value)} />
        </div>

        <div className="setting-group">
          <div className="toggle-row">
            <label style={{ margin: 0 }}>Scanlines</label>
            <div
              className={`toggle-switch ${scanlines ? 'active' : ''}`}
              onClick={() => setScanlines(!scanlines)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="refresh-btn" onClick={handleSave}>SAVE</button>
          <button className="refresh-btn" onClick={onClose}>CANCEL</button>
        </div>
      </div>
    </div>
  )
}
