export interface Segment {
  id: string;
  task_id: string;
  start_time: number;
  end_time: number;
  text: string;
  speaker_id?: string;
  speaker_name?: string;
  confidence?: number;
  is_crosstalk: boolean;
  is_checked: boolean;
  status: 'pending' | 'edited' | 'verified' | 'rejected';
  comments?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  segment_id: string;
  author_id: string;
  author_name: string;
  text: string;
  status: 'open' | 'resolved';
  created_at: string;
}