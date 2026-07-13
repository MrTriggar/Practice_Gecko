import { SPEAKER_PALETTE } from './speakerColors'
import './SpeakerSelector.css'

interface SpeakerSelectorProps {
  value?: string
  onChange: (speakerId: string) => void
}

export function SpeakerSelector({ value, onChange }: SpeakerSelectorProps) {
  return (
    <div className="speaker-selector">
      {SPEAKER_PALETTE.map((speaker) => (
        <button
          key={speaker.id}
          className={`speaker-selector__item ${value === speaker.id ? 'speaker-selector__item--active' : ''}`}
          style={{ borderColor: speaker.border }}
          onClick={() => onChange(speaker.id)}
          title={speaker.label}
        >
          <span className="speaker-selector__dot" style={{ background: speaker.border }} />
          {speaker.id}
        </button>
      ))}
    </div>
  )
}