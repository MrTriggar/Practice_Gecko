import { useState } from 'react'
import { User, Sparkles, BookOpen, MessageSquare, BarChart3, ChevronRight, ChevronLeft } from 'lucide-react'
import { DictionaryPanel } from './DictionaryPanel'
import { MLAssistantPanel } from './MLAssistantPanel'
import type { Segment } from '../../types/segment'
import './RightSidebar.css'

const TABS = [
  { id: 'account', icon: User, label: 'Аккаунт' },
  { id: 'ml', icon: Sparkles, label: 'ML-помощник' },
  { id: 'dictionary', icon: BookOpen, label: 'Словари' },
  { id: 'comments', icon: MessageSquare, label: 'Комментарии' },
  { id: 'analytics', icon: BarChart3, label: 'Аналитика' },
]

interface RightSidebarProps {
  segments: Segment[]
  projectId: number
}

export function RightSidebar({ segments, projectId }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState('ml')
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`right-sidebar ${collapsed ? 'right-sidebar--collapsed' : ''}`}>
      <button
        className="right-sidebar__toggle"
        onClick={() => setCollapsed((c) => !c)}
        aria-label="Свернуть панель"
      >
        {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {!collapsed && (
        <>
          <div className="right-sidebar__tabs">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  className={`right-sidebar__tab ${activeTab === tab.id ? 'right-sidebar__tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          <div className="right-sidebar__content">
            {activeTab === 'account' && <p>Информация об аккаунте пользователя</p>}
            {activeTab === 'ml' && <MLAssistantPanel segments={segments} />}
            {activeTab === 'dictionary' && <DictionaryPanel projectId={projectId} />}
            {activeTab === 'comments' && <p>Комментарии верификатора</p>}
            {activeTab === 'analytics' && <p>Скорость разметки, статистика задач</p>}
          </div>
        </>
      )}
    </div>
  )
}