import { SpeakerSelector } from './SpeakerSelector'
import './TextEditor.css'

interface TextEditorProps {
  value: string
  speaker?: string
  onChange: (text: string) => void
  onSpeakerChange?: (speaker: string) => void
  saveStatus: 'saved' | 'saving' | 'idle'
}

export function TextEditor({ value, speaker, onChange, onSpeakerChange, saveStatus }: TextEditorProps) {
  return (
    <div className="text-editor">
      <div className="text-editor__header">
        <SpeakerSelector value={speaker} onChange={(s) => onSpeakerChange?.(s)} />
        <span className={`text-editor__status text-editor__status--${saveStatus}`}>
          {saveStatus === 'saving' ? 'Сохранение...' : saveStatus === 'saved' ? 'Сохранено' : ''}
        </span>
      </div>
      <textarea
        className="text-editor__textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}