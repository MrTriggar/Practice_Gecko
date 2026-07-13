import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderOpen, Plus, Loader2, X } from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'
import { listTasks, createTask } from '../api/tasks'
import { uploadMedia } from '../api/media'
import { importSegments } from '../api/segments'
import type { Task } from '../types/task'
import './ProjectsPage.css'

const STATUS_LABELS: Record<Task['status'], string> = {
  pending: 'Ожидает',
  in_progress: 'В работе',
  verification: 'На проверке',
  rework: 'На доработке',
  done: 'Готово',
}

interface RawSegment {
  start: number
  end: number
  text?: string
}

export function ProjectsPage() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [projectId, setProjectId] = useState('1')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [jsonFile, setJsonFile] = useState<File | null>(null)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  useEffect(() => {
    listTasks()
      .then(setTasks)
      .catch((err) => setError(err instanceof Error ? err.message : 'Ошибка загрузки задач'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mediaFile) return

    setCreating(true)
    setCreateError(null)

    try {
      const uploaded = await uploadMedia(mediaFile)
      const task = await createTask(Number(projectId), uploaded.url)

      if (jsonFile) {
        const text = await jsonFile.text()
        const parsed = JSON.parse(text)
        const rawSegments: RawSegment[] = Array.isArray(parsed) ? parsed : parsed.segments ?? []
        const items = rawSegments.map((s) => ({ start: s.start, end: s.end, text: s.text ?? '' }))
        if (items.length > 0) {
          await importSegments(task.id, items)
        }
      }

      setTasks((prev) => [...prev, task])
      closeModal()
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Ошибка создания задачи')
    } finally {
      setCreating(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setMediaFile(null)
    setJsonFile(null)
    setCreateError(null)
  }

  return (
    <div className="projects-page">
      <header className="projects-header">
        <span className="projects-header__brand">SANDER</span>
        <ThemeToggle />
      </header>

      <div className="projects-content">
        <div className="projects-content__top">
          <h1>Задачи</h1>
          <button className="btn-new-project" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Новая задача
          </button>
        </div>

        {loading && (
          <div className="projects-loading">
            <Loader2 size={28} className="spin" />
            <p>Загружаем задачи...</p>
          </div>
        )}

        {error && <div className="projects-error">{error}</div>}

        {!loading && !error && tasks.length === 0 && (
          <div className="projects-empty">
            <FolderOpen size={40} />
            <p>Пока нет ни одной задачи. Создайте первую.</p>
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <div className="projects-grid">
            {tasks.map((task) => (
              <div key={task.id} className="project-card" onClick={() => navigate(`/editor?task=${task.id}`)}>
                <div className="project-card__icon">
                  <FolderOpen size={28} />
                </div>
                <div className="project-card__info">
                  <h3>Задача #{task.id}</h3>
                  <p>{task.audio_url}</p>
                  <div className="project-card__meta">
                    <span className={`status-badge status-badge--${task.status}`}>
                      {STATUS_LABELS[task.status]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box__header">
              <h2>Новая задача</h2>
              <button onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            {createError && <div className="projects-error">{createError}</div>}

            <form onSubmit={handleCreate}>
              <label>
                ID проекта
                <input value={projectId} onChange={(e) => setProjectId(e.target.value)} required />
              </label>
              <label>
                Медиафайл (видео/аудио)
                <input
                  type="file"
                  accept="video/*,audio/*"
                  onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
                  required
                />
              </label>
              <label>
                JSON с сегментами (опционально)
                <input type="file" accept=".json" onChange={(e) => setJsonFile(e.target.files?.[0] ?? null)} />
              </label>
              <button className="btn-new-project" type="submit" disabled={creating}>
                {creating ? 'Загружаем...' : 'Создать'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}