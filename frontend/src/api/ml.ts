const ML_SERVICE_ORIGIN = 'http://localhost:8001'

export interface CheckTermsResult {
  term: string
  status: string
  comment?: string
}

export interface SuggestIssue {
  segment_id: number
  issue: string
  severity: string
}

export async function checkTerms(text: string): Promise<CheckTermsResult[]> {
  const res = await fetch(`${ML_SERVICE_ORIGIN}/check_terms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error('ML check_terms failed')
  const data = await res.json()
  return data.terms
}

export async function suggestFix(
  segments: { id: number; text: string }[]
): Promise<SuggestIssue[]> {
  const res = await fetch(`${ML_SERVICE_ORIGIN}/suggest_fix`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ segments }),
  })
  if (!res.ok) throw new Error('ML suggest_fix failed')
  const data = await res.json()
  return data.issues
}