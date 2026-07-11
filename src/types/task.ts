import type { Segment } from './segment';

export interface Task {
  id: string;
  project_id: string;
  project_name?: string;
  audio_url: string;
  video_url?: string;
  assignee_id: string;
  verifier_id?: string;
  status: 'pending' | 'in_progress' | 'verification' | 'rework' | 'done' | 'exported';
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  duration?: number;
  created_at: string;
  updated_at: string;
  segments: Segment[];
}