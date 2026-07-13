import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SpeakersPanel } from './SpeakersPanel'
import './LeftSidebar.css'

export function LeftSidebar() {
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

      {!collapsed && <SpeakersPanel />}
    </div>
  )
}