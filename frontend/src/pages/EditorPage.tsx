import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { LeftSidebar } from '../features/editor/LeftSidebar'
import { RightSidebar } from '../features/editor/RightSidebar'
import { VideoPanel } from '../features/editor/VideoPanel'
import { WaveformPlayer } from '../features/editor/WaveformPlayer'
import { ToolsPanel } from '../features/editor/ToolsPanel'
import { SegmentList } from '../features/editor/SegmentList'
import { TextEditor } from '../features/editor/TextEditor'
import { ImportExportBar } from '../features/editor/ImportExportBar'
import { ThemeToggle } from '../components/ThemeToggle'
import { listSegmentsByTask, updateSegment } from '../api/segments'
import { getTask } from '../api/tasks'
import type { Segment } from '../types/segment'
import type { Task } from '../types/task'
import './EditorPage.css'

const BACKEND_ORIGIN = 'http://localhost:8080'

function resolveMediaUrl(path: string) {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  return `${BACKEND_ORIGIN}${path}`
}

export function EditorPage() {
  const [searchParams] = useSearchParams()
  const taskId = Number(searchParams.get('task')) || null

  const [task, setTask] = useState<Task | null>(null)
  const [segments, setSegments] = useState<Segment[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [activeSpeaker, setActiveSpeaker] = useState<string | undefined>(undefined)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('saved')
  const [activeTool, setActiveTool] = useState('select')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!taskId) {
      setError('Не указана задача (task) в адресе страницы')
      setLoading(false)
      return
    }

    Promise.all([getTask(taskId), listSegmentsByTask(taskId)])
      .then(([taskData, segmentsData]) => {
        setTask(taskData)
        setSegments(segmentsData)
        if (segmentsData.length > 0) setActiveId(segmentsData[0].id)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Ошибка загрузки задачи'))
      .finally(() => setLoading(false))
  }, [taskId])

  const activeSegment = segments.find((s) => s.id === activeId)
  const mediaUrl = task ? resolveMediaUrl(task.audio_url) : undefined

  const handleTextChange = useCallback(
    (text: string) => {
      if (!activeId) return

      setSaveStatus('saving')
      setSegments((prev) => prev.map((s) => (s.id === activeId ? { ...s, text } : s)))

      if (saveTimeout.current) clearTimeout(saveTimeout.current)

      saveTimeout.current = setTimeout(() => {
        updateSegment(Number(activeId), { text })
          .then(() => setSaveStatus('saved'))
          .catch(() => setSaveStatus('idle'))
      }, 600)
    },
    [activeId]
  )

  const handleSpeakerChange = useCallback(
    (speaker: string) => {
      if (!activeId) return

      setSegments((prev) => prev.map((s) => (s.id === activeId ? { ...s, speaker } : s)))
      setSaveStatus('saving')

      updateSegment(Number(activeId), { speaker } as any)
        .then(() => setSaveStatus('saved'))
        .catch(() => {
          console.error('Failed to save speaker')
          setSaveStatus('idle')
        })
    },
    [activeId]
  )

  const handleSegmentTimeChange = useCallback((id: string, start: number, end: number) => {
    setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, start, end } : s)))
    updateSegment(Number(id), { start_time: start, end_time: end }).catch(() => {
      console.error('Failed to save segment time')
    })
  }, [])

  if (loading) {
    return (
      <div className="editor-layout editor-layout--loading">
        <Loader2 size={32} className="spin" />
        <p>Загружаем задачу...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="editor-layout editor-layout--error">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="editor-layout">
      <header className="editor-layout__header">
        <span className="editor-layout__brand">SANDER</span>
        <ImportExportBar />
        <ThemeToggle />
      </header>

      <div className="editor-layout__body">
        <LeftSidebar
          segments={segments}
          activeSpeaker={activeSpeaker}
          onSelectSpeaker={setActiveSpeaker}
        />

        <main className="editor-layout__center">
          <VideoPanel ref={videoRef} videoUrl={mediaUrl} />
          <WaveformPlayer
            audioUrl={mediaUrl}
            segments={segments}
            activeId={activeId}
            onSelectSegment={setActiveId}
            onSegmentTimeChange={handleSegmentTimeChange}
          />
          <ToolsPanel activeTool={activeTool} onSelectTool={setActiveTool} />
          <div className="editor-layout__text-section">
            <SegmentList segments={segments} activeId={activeId} onSelect={setActiveId} />
            {activeSegment && (
              <TextEditor
                value={activeSegment.text}
                speaker={activeSegment.speaker}
                onChange={handleTextChange}
                onSpeakerChange={handleSpeakerChange}
                saveStatus={saveStatus}
              />
            )}
          </div>
        </main>

        <RightSidebar segments={segments} projectId={task?.project_id || 0} />
      </div>
    </div>
  )
}