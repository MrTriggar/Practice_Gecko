import { UserCircle } from 'lucide-react'
import type { Speaker } from '../../types/speaker'
import './SpeakersPanel.css'

const MOCK_SPEAKERS: Speaker[] = [
  { id: 'S1', name: 'Спикер 1', color: '#a463e0' },
  { id: 'S2', name: 'Спикер 2', color: '#e05a5a' },
]

export function SpeakersPanel() {
  return (
    <div className="speakers-panel">
      <h4 className="speakers-panel__title">Спикеры</h4>
      <div className="speakers-panel__list">
        {MOCK_SPEAKERS.map((speaker) => (
          <div key={speaker.id} className="speaker-item">
            <UserCircle size={20} style={{ color: speaker.color }} />
            <span>{speaker.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}