export default function ProbBar({ home, draw, away, homeLabel, awayLabel }) {
  return (
    <div className="probbar">
      <div className="probbar-track">
        <div className="probbar-seg seg-home" style={{ width: `${home}%` }} />
        <div className="probbar-seg seg-draw" style={{ width: `${draw}%` }} />
        <div className="probbar-seg seg-away" style={{ width: `${away}%` }} />
      </div>
      <div className="probbar-labels">
        <span className="pl-home"><b>{home.toFixed(1)}%</b> {homeLabel}</span>
        <span className="pl-draw"><b>{draw.toFixed(1)}%</b> Empate</span>
        <span className="pl-away"><b>{away.toFixed(1)}%</b> {awayLabel}</span>
      </div>
    </div>
  )
}
