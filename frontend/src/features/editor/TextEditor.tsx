import './TextEditor.css'

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
  saveStatus: 'saved' | 'saving' | 'idle'
}

export function TextEditor({ value, onChange, saveStatus }: TextEditorProps) {
  return (
    <div className="text-editor">
      <div className="text-editor__header">
        <span>Текст сегмента</span>
        <span className={`text-editor__status text-editor__status--${saveStatus}`}>
          {saveStatus === 'saved' && 'Сохранено'}
          {saveStatus === 'saving' && 'Сохранение...'}
          {saveStatus === 'idle' && ''}
        </span>
      </div>
      <textarea
        className="text-editor__textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Текст сегмента появится здесь..."
      />
    </div>
  )
}