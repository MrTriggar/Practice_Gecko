import { useEffect } from 'react'
import { MousePointer2, Scissors, Merge, Plus, Trash2, Undo2, Redo2 } from 'lucide-react'
import './ToolsPanel.css'

const TOOLS = [
  { id: 'select', icon: MousePointer2, label: 'Выбор', hotkey: 'V' },
  { id: 'split', icon: Scissors, label: 'Разделить', hotkey: 'X' },
  { id: 'merge', icon: Merge, label: 'Объединить', hotkey: 'Ctrl+J' },
  { id: 'add', icon: Plus, label: 'Добавить сегмент', hotkey: 'Shift+A' },
  { id: 'delete', icon: Trash2, label: 'Удалить', hotkey: 'Delete' },
  { id: 'undo', icon: Undo2, label: 'Отменить', hotkey: 'Ctrl+Z' },
  { id: 'redo', icon: Redo2, label: 'Повторить', hotkey: 'Ctrl+Shift+Z' },
]

interface ToolsPanelProps {
  activeTool: string
  onSelectTool: (id: string) => void
}

export function ToolsPanel({ activeTool, onSelectTool }: ToolsPanelProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      if (isTyping) return

      const key = e.key.toLowerCase()

      if (e.ctrlKey && e.shiftKey && key === 'z') {
        e.preventDefault()
        onSelectTool('redo')
        return
      }
      if (e.ctrlKey && key === 'z') {
        e.preventDefault()
        onSelectTool('undo')
        return
      }
      if (e.ctrlKey && key === 'j') {
        e.preventDefault()
        onSelectTool('merge')
        return
      }
      if (e.shiftKey && key === 'a') {
        e.preventDefault()
        onSelectTool('add')
        return
      }
      if (key === 'v') {
        onSelectTool('select')
        return
      }
      if (key === 'x') {
        onSelectTool('split')
        return
      }
      if (key === 'delete' || key === 'backspace') {
        onSelectTool('delete')
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSelectTool])

  return (
    <div className="tools-panel">
      {TOOLS.map((tool) => {
        const Icon = tool.icon
        return (
          <button
            key={tool.id}
            className={`tools-panel__btn ${activeTool === tool.id ? 'tools-panel__btn--active' : ''}`}
            onClick={() => onSelectTool(tool.id)}
            title={`${tool.label} (${tool.hotkey})`}
            aria-label={tool.label}
          >
            <Icon size={18} />
          </button>
        )
      })}
    </div>
  )
}