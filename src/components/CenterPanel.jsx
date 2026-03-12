import ClockDefault from './ClockDefault.jsx'

export default function CenterPanel({ activeWidget, onClose, children }) {
  return (
    <div className="center-panel glass-panel">
      {activeWidget ? (
        <>
          <button className="close-btn" onClick={onClose}>[X]</button>
          {children}
        </>
      ) : (
        <ClockDefault />
      )}
    </div>
  )
}
