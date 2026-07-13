import { useState, useEffect } from 'react'
import { Plus, Check, X, MessageCircle, Trash2 } from 'lucide-react'
import { listTermsByProject, createTerm, updateTerm, deleteTerm, type Term } from '../../api/terms'
import './DictionaryPanel.css'

interface DictionaryPanelProps {
  projectId: number
}

export function DictionaryPanel({ projectId }: DictionaryPanelProps) {
  const [terms, setTerms] = useState<Term[]>([])
  const [newTerm, setNewTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return
    listTermsByProject(projectId)
      .then(setTerms)
      .catch(() => setTerms([]))
      .finally(() => setLoading(false))
  }, [projectId])

  const handleAdd = async () => {
    if (!newTerm.trim()) return
    const term = await createTerm(projectId, newTerm.trim())
    setTerms((prev) => [...prev, term])
    setNewTerm('')
  }

  const handleStatusChange = async (id: number, status: string) => {
    const updated = await updateTerm(id, { status })
    setTerms((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTerm(id)
      setTerms((prev) => prev.filter((t) => t.id !== id))
    } catch {
      console.error('Failed to delete term')
    }
  }

  if (loading) return <p className="dictionary-panel__loading">Загрузка словаря...</p>

  return (
    <div className="dictionary-panel">
      <div className="dictionary-panel__add">
        <input
          value={newTerm}
          onChange={(e) => setNewTerm(e.target.value)}
          placeholder="Новый термин (напр. TATLIN)"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd}>
          <Plus size={16} />
        </button>
      </div>

      {terms.length === 0 ? (
        <p className="dictionary-panel__empty">Термины проекта пока не добавлены</p>
      ) : (
        <div className="dictionary-panel__list">
          {terms.map((term) => (
            <div key={term.id} className={`dictionary-panel__item dictionary-panel__item--${term.status}`}>
              <span className="dictionary-panel__text">{term.text}</span>
              <div className="dictionary-panel__actions">
                <button title="Одобрить" onClick={() => handleStatusChange(term.id, 'approved')}>
                  <Check size={14} />
                </button>
                <button title="Отклонить" onClick={() => handleStatusChange(term.id, 'rejected')}>
                  <X size={14} />
                </button>
                <button title="Удалить" onClick={() => handleDelete(term.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
              {term.comment && (
                <span className="dictionary-panel__comment">
                  <MessageCircle size={12} /> {term.comment}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}