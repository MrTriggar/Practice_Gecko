import { useRef } from 'react'
import { Play, Pause, ZoomIn, ZoomOut } from 'lucide-react'
import { useWaveform } from './useWaveform'
import type { Segment } from '../../types/segment'
import './WaveformPlayer.css'

interface WaveformPlayerProps {
  audioUrl?: string
  segments?: Segment[]
  activeId?: string
  onSelectSegment?: (id: string) => void
  onSegmentTimeChange?: (id: string, start: number, end: number) => void
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2]

export function WaveformPlayer({
  audioUrl,
  segments = [],
  onSelectSegment,
  onSegmentTimeChange,
}: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    isReady,
    zoomLevel,
    setZoom,
    playbackRate,
    setRate,
  } = useWaveform(containerRef, audioUrl, segments, {
    onRegionUpdate: (id, start, end) => onSegmentTimeChange?.(id, start, end),
    onRegionClick: (id) => onSelectSegment?.(id),
  })

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="waveform-panel">
      <div className="waveform-controls">
        <button className="waveform-play-btn" onClick={togglePlay} aria-label="Play/Pause" disabled={!isReady}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <span className="waveform-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className="waveform-controls__speed">
          <span className="waveform-controls__label">Скорость</span>
          <select
            value={playbackRate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="waveform-controls__select"
          >
            {SPEED_OPTIONS.map((rate) => (
              <option key={rate} value={rate}>
                {rate}x
              </option>
            ))}
          </select>
        </div>

        <div className="waveform-controls__zoom">
          <button onClick={() => setZoom(zoomLevel - 20)} aria-label="Уменьшить масштаб">
            <ZoomOut size={16} />
          </button>
          <input
            type="range"
            min={10}
            max={300}
            value={zoomLevel}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="waveform-controls__zoom-slider"
          />
          <button onClick={() => setZoom(zoomLevel + 20)} aria-label="Увеличить масштаб">
            <ZoomIn size={16} />
          </button>
        </div>

        {!isReady && <span className="waveform-loading">Загрузка волны...</span>}
      </div>
      <div ref={containerRef} className="waveform-container" />
    </div>
  )
}