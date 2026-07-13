import { useState } from 'react'
import { Sparkles, AlertTriangle, Loader2 } from 'lucide-react'
import { checkTerms, suggestFix, type CheckTermsResult, type SuggestIssue } from '../../api/ml'
import type { Segment } from '../../types/segment'
import './MLAssistantPanel.css'

interface MLAssistantPanelProps {
  segments: Segment[]
}

export function MLAssistantPanel({ segments }: MLAssistantPanelProps) {
  const [termsResult, setTermsResult] = useState<CheckTermsResult[]>([])
  const [issues, setIssues] = useState<SuggestIssue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fullText = segments.map((s) => s.text).join(' ')

  const handleCheckTerms = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await checkTerms(fullText)
      setTermsResult(result)
    } catch {
      setError('ML-сервис недоступен')
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestFix = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await suggestFix(
        segments.map((s) => ({ id: Number(s.id), text: s.text }))
      )
      setIssues(result)
    } catch {
      setError('ML-сервис недоступен')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ml-panel">
      <div className="ml-panel__actions">
        <button onClick={handleCheckTerms} disabled={loading}>
          <Sparkles size={14} /> Проверить термины
        </button>
        <button onClick={handleSuggestFix} disabled={loading}>
          <AlertTriangle size={14} /> Найти проблемы
        </button>
      </div>

      {loading && (
        <div className="ml-panel__loading">
          <Loader2 size={16} className="spin" /> Анализ...
        </div>
      )}

      {error && <p className="ml-panel__error">{error}</p>}

      {termsResult.length > 0 && (
        <div className="ml-panel__section">
          <h5>Термины</h5>
          {termsResult.map((t, i) => (
            <div key={i} className={`ml-panel__term ml-panel__term--${t.status}`}>
              <span>{t.term}</span>
              {t.comment && <span className="ml-panel__term-comment">{t.comment}</span>}
            </div>
          ))}
        </div>
      )}

      {issues.length > 0 && (
        <div className="ml-panel__section">
          <h5>Найденные проблемы</h5>
          {issues.map((issue, i) => (
            <div key={i} className={`ml-panel__issue ml-panel__issue--${issue.severity}`}>
              <span className="ml-panel__issue-segment">Сегмент {issue.segment_id}</span>
              <span>{issue.issue}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}