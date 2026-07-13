import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Upload, FileJson, FileText, FileSpreadsheet } from 'lucide-react'
import { exportTask, importSegments } from '../../api/segments'
import './ImportExportBar.css'

export function ImportExportBar() {
  const [searchParams] = useSearchParams()
  const taskId = Number(searchParams.get('task'))
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const handleExport = async (format: 'json' | 'csv' | 'srt') => {
    if (!taskId) return
    setBusy(true)
    try {
      const blob = await exportTask(taskId, format)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `task_${taskId}.${format}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Ошибка экспорта: ' + (err instanceof Error ? err.message : 'unknown'))
    } finally {
      setBusy(false)
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !taskId) return

    setBusy(true)
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const segments = Array.isArray(parsed) ? parsed : parsed.segments
      if (!Array.isArray(segments)) throw new Error('Неверный формат JSON')

      await importSegments(taskId, segments)
      window.location.reload()
    } catch (err) {
      alert('Ошибка импорта: ' + (err instanceof Error ? err.message : 'unknown'))
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <div className="import-export-bar">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button onClick={handleImportClick} disabled={busy} title="Импорт JSON">
        <Upload size={16} />
        <span>Импорт JSON</span>
      </button>
      <button onClick={() => handleExport('json')} disabled={busy} title="Экспорт JSON">
        <FileJson size={16} />
      </button>
      <button onClick={() => handleExport('csv')} disabled={busy} title="Экспорт CSV">
        <FileSpreadsheet size={16} />
      </button>
      <button onClick={() => handleExport('srt')} disabled={busy} title="Экспорт SRT">
        <FileText size={16} />
      </button>
    </div>
  )
}