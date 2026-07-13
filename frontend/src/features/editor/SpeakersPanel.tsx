import type { Segment } from '../../types/segment'
import { getSpeakerColor } from './speakerColors'
import './SpeakersPanel.css'

interface SpeakersPanelProps {
  segments: Segment[]
  activeSpeaker?: string
  onSelectSpeaker?: (speaker: string) => void
}

export function SpeakersPanel({ segments, activeSpeaker, onSelectSpeaker }: SpeakersPanelProps) {
  const speakerIds = Array.from(new Set(segments.map((s) => s.speaker).filter(Boolean))) as string[]

  return (
    <div className="speakers-panel">
      <h4 className="speakers-panel__title">Спикеры</h4>

      {speakerIds.length === 0 ? (
        <p className="speakers-panel__empty">Спикеры пока не назначены</p>
      ) : (
        <div className="speakers-panel__list">
          {speakerIds.map((id) => {
            const palette = getSpeakerColor(id)
            const count = segments.filter((s) => s.speaker === id).length
            return (
              <button
                key={id}
                className={`speakers-panel__item ${activeSpeaker === id ? 'speakers-panel__item--active' : ''}`}
                onClick={() => onSelectSpeaker?.(id)}
              >
                <span className="speakers-panel__dot" style={{ background: palette.border }} />
                <span className="speakers-panel__label">{id}</span>
                <span className="speakers-panel__count">{count}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}