export const SPEAKER_PALETTE = [
  { id: 'S1', label: 'Спикер 1', color: 'rgba(164, 99, 224, 0.35)', border: '#a463e0' },
  { id: 'S2', label: 'Спикер 2', color: 'rgba(194, 59, 59, 0.35)', border: '#c23b3b' },
  { id: 'S3', label: 'Спикер 3', color: 'rgba(59, 194, 143, 0.35)', border: '#3bc28f' },
  { id: 'S4', label: 'Спикер 4', color: 'rgba(224, 180, 60, 0.35)', border: '#e0b43c' },
  { id: 'S5', label: 'Спикер 5', color: 'rgba(60, 140, 224, 0.35)', border: '#3c8ce0' },
  { id: 'S6', label: 'Спикер 6', color: 'rgba(224, 99, 164, 0.35)', border: '#e063a4' },
]

export function getSpeakerColor(speakerId?: string) {
  if (!speakerId) return SPEAKER_PALETTE[0]
  const found = SPEAKER_PALETTE.find((s) => s.id === speakerId)
  return found || SPEAKER_PALETTE[0]
}