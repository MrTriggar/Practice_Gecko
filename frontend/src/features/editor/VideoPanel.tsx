import { useState, forwardRef } from 'react'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import './VideoPanel.css'

interface VideoPanelProps {
  videoUrl?: string
}

export const VideoPanel = forwardRef<HTMLVideoElement, VideoPanelProps>(({ videoUrl }, ref) => {
  const [zoom, setZoom] = useState(1)

  return (
    <div className="video-panel">
      <div className="video-panel__controls">
        <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))} aria-label="Уменьшить">
          <ZoomOut size={16} />
        </button>
        <button onClick={() => setZoom(1)} aria-label="Сбросить масштаб">
          <Maximize2 size={16} />
        </button>
        <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))} aria-label="Увеличить">
          <ZoomIn size={16} />
        </button>
      </div>
      <div className="video-panel__frame" style={{ transform: `scale(${zoom})` }}>
        {videoUrl ? (
          <video
            ref={ref}
            src={videoUrl}
            controls
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <span>Видео не загружено</span>
        )}
      </div>
    </div>
  )
})

VideoPanel.displayName = 'VideoPanel'