import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SpeakersPanel } from './SpeakersPanel'
import type { Segment } from '../../types/segment'
import './LeftSidebar.css'

interface LeftSidebarProps {
  segments: Segment[]
  activeSpeaker?: string
  onSelectSpeaker?: (speaker: string) => void
}

export function LeftSidebar({ segments, activeSpeaker, onSelectSpeaker }: LeftSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`left-sidebar ${collapsed ? 'left-sidebar--collapsed' : ''}`}>
      <button
        className="left-sidebar__toggle"
        onClick={() => setCollapsed((c) => !c)}
        aria-label="Свернуть панель"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {!collapsed && (
        <SpeakersPanel segments={segments} activeSpeaker={activeSpeaker} onSelectSpeaker={onSelectSpeaker} />
      )}
    </div>
  )
}