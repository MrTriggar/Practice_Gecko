import { MousePointer2, Scissors, Merge, Plus, Trash2, Undo2, Redo2 } from 'lucide-react'
import './ToolsPanel.css'

const TOOLS = [
  { id: 'select', icon: MousePointer2, label: 'Выбор' },
  { id: 'split', icon: Scissors, label: 'Разделить' },
  { id: 'merge', icon: Merge, label: 'Объединить' },
  { id: 'add', icon: Plus, label: 'Добавить сегмент' },
  { id: 'delete', icon: Trash2, label: 'Удалить' },
  { id: 'undo', icon: Undo2, label: 'Отменить' },
  { id: 'redo', icon: Redo2, label: 'Повторить' },
]

interface ToolsPanelProps {
  activeTool: string
  onSelectTool: (id: string) => void
}

export function ToolsPanel({ activeTool, onSelectTool }: ToolsPanelProps) {
  return (
    <div className="tools-panel">
      {TOOLS.map((tool) => {
        const Icon = tool.icon
        return (
          <button
            key={tool.id}
            className={`tools-panel__btn ${activeTool === tool.id ? 'tools-panel__btn--active' : ''}`}
            onClick={() => onSelectTool(tool.id)}
            title={tool.label}
            aria-label={tool.label}
          >
            <Icon size={18} />
          </button>
        )
      })}
    </div>
  )
}