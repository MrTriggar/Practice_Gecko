import { useRef } from 'react'
import { Play, Pause } from 'lucide-react'
import { useWaveform } from './useWaveform'
import './WaveformPlayer.css'

interface WaveformPlayerProps {
  audioUrl?: string
}

export function WaveformPlayer({ audioUrl }: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isPlaying, currentTime, duration, togglePlay } = useWaveform(containerRef, audioUrl)

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="waveform-panel">
      <div className="waveform-controls">
        <button className="waveform-play-btn" onClick={togglePlay} aria-label="Play/Pause">
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <span className="waveform-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      <div ref={containerRef} className="waveform-container" />
    </div>
  )
}