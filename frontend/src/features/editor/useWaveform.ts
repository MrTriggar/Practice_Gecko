import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

export function useWaveform(containerRef: React.RefObject<HTMLDivElement | null>, audioUrl?: string) {
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#a463e0',
      progressColor: '#c23b3b',
      cursorColor: '#f2f1f4',
      height: 100,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
    })

    wavesurferRef.current = ws
    ws.load(audioUrl).catch((err) => console.error('WaveSurfer load failed:', err))

    ws.on('play', () => setIsPlaying(true))
    ws.on('pause', () => setIsPlaying(false))
    ws.on('audioprocess', () => setCurrentTime(ws.getCurrentTime()))
    ws.on('ready', () => setDuration(ws.getDuration()))

    return () => {
      wavesurferRef.current = null
      try { ws.destroy() } catch {}
    }
  }, [audioUrl])

  const togglePlay = () => wavesurferRef.current?.playPause()

  return { isPlaying, currentTime, duration, togglePlay }
}