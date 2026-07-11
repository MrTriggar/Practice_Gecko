export interface Term {
  id: string;
  project_id: string;
  value: string;
  normalized_value: string;
  type: 'technical' | 'abbreviation' | 'product' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  created_at: string;
}