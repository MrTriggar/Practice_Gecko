import { useEffect, useRef, useState, useCallback } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js'
import type { Segment } from '../../types/segment'
import { getSpeakerColor } from './speakerColors'

interface UseWaveformOptions {
  onRegionUpdate?: (segmentId: string, start: number, end: number) => void
  onRegionClick?: (segmentId: string) => void
}

export function useWaveform(
  containerRef: React.RefObject<HTMLDivElement | null>,
  audioUrl?: string,
  segments: Segment[] = [],
  options: UseWaveformOptions = {}
) {
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const regionsRef = useRef<RegionsPlugin | null>(null)
  const initializedRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(50)
  const [playbackRate, setPlaybackRate] = useState(1)

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return
    if (initializedRef.current) return
    initializedRef.current = true

    containerRef.current.innerHTML = ''

    const regions = RegionsPlugin.create()

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#5a4570',
      progressColor: '#c23b3b',
      cursorColor: '#f2f1f4',
      height: 100,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      minPxPerSec: zoomLevel,
      plugins: [regions],
    })

    wavesurferRef.current = ws
    regionsRef.current = regions

    ws.on('play', () => setIsPlaying(true))
    ws.on('pause', () => setIsPlaying(false))
    ws.on('audioprocess', () => setCurrentTime(ws.getCurrentTime()))
    ws.on('ready', () => {
      setDuration(ws.getDuration())
      setIsReady(true)
    })
    ws.on('error', (err) => console.error('WaveSurfer error:', err))

    const load = () => {
      ws.load(audioUrl).catch((err) => {
        if (err?.name !== 'AbortError') {
          console.error('WaveSurfer load failed, retrying:', err)
          setTimeout(load, 800)
        }
      })
    }
    load()

    return () => {
      initializedRef.current = false
      wavesurferRef.current = null
      regionsRef.current = null
      try {
        ws.destroy()
      } catch {
        // ignore
      }
    }
  }, [audioUrl])

  useEffect(() => {
    const regions = regionsRef.current
    if (!regions || !isReady) return

    regions.clearRegions()

    segments.forEach((seg) => {
      const palette = getSpeakerColor(seg.speaker)
      const region = regions.addRegion({
        id: seg.id,
        start: seg.start,
        end: seg.end,
        content: seg.text?.slice(0, 20) || '',
        color: palette.color,
        drag: true,
        resize: true,
      })

      region.on('update-end', () => {
        options.onRegionUpdate?.(seg.id, region.start, region.end)
      })

      region.on('click', () => {
        options.onRegionClick?.(seg.id)
      })
    })
  }, [segments, isReady])

  const togglePlay = useCallback(() => {
    wavesurferRef.current?.playPause()
  }, [])

  const seekTo = useCallback((time: number) => {
    const ws = wavesurferRef.current
    if (!ws || !ws.getDuration()) return
    ws.seekTo(time / ws.getDuration())
  }, [])

  const setZoom = useCallback((px: number) => {
    const clamped = Math.max(10, Math.min(300, px))
    setZoomLevel(clamped)
    wavesurferRef.current?.zoom(clamped)
  }, [])

  const setRate = useCallback((rate: number) => {
    setPlaybackRate(rate)
    wavesurferRef.current?.setPlaybackRate(rate)
  }, [])

  return {
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seekTo,
    isReady,
    zoomLevel,
    setZoom,
    playbackRate,
    setRate,
  }
}