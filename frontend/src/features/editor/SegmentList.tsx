import type { Segment } from '../../types/segment'
import './SegmentList.css'

interface SegmentListProps {
  segments: Segment[]
  activeId?: string
  onSelect: (id: string) => void
}

export function SegmentList({ segments, activeId, onSelect }: SegmentListProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = (seconds % 60).toFixed(1)
    return `${m}:${s.padStart(4, '0')}`
  }

  return (
    <div className="segment-list">
      {segments.map((seg) => (
        <div
          key={seg.id}
          className={`segment-item ${activeId === seg.id ? 'segment-item--active' : ''}`}
          onClick={() => onSelect(seg.id)}
        >
          <span className="segment-item__time">
            {formatTime(seg.start)} — {formatTime(seg.end)}
          </span>
          <span className="segment-item__text">{seg.text || '—'}</span>
          {seg.speaker && <span className="segment-item__speaker">{seg.speaker}</span>}
        </div>
      ))}
    </div>
  )
}