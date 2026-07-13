import type { Project } from '../../types/project'

export const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'Интервью YADRO Q3', description: 'Разметка интервью для отчёта', status: 'active', tasksTotal: 12, tasksDone: 5 },
  { id: '2', name: 'Подкаст TATLIN', description: 'Аудиоразметка серии подкастов', status: 'active', tasksTotal: 8, tasksDone: 8 },
  { id: '3', name: 'Видео-обучение', description: 'Разметка обучающих видео', status: 'archived', tasksTotal: 20, tasksDone: 20 },
]