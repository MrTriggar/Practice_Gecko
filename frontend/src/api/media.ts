export async function uploadMedia(file: File): Promise<{ url: string; filename: string }> {
  const token = localStorage.getItem('sander_token')
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('http://localhost:8080/api/media/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Ошибка загрузки файла' }))
    throw new Error(body.error || 'Ошибка загрузки файла')
  }

  return response.json()
}