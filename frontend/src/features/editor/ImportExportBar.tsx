import { Upload, Download } from 'lucide-react'
import './ImportExportBar.css'

export function ImportExportBar() {
  return (
    <div className="import-export-bar">
      <label className="ie-btn ie-btn--import">
        <Upload size={16} />
        Импорт
        <input type="file" accept="video/*,audio/*,.json" hidden />
      </label>
      <button className="ie-btn ie-btn--export">
        <Download size={16} />
        Экспорт
      </button>
    </div>
  )
}