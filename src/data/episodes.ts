import { getCurriculumEpisode, getEpisodeExpressions } from './curriculum'
import { Episode } from '@/types'

export const EP01: Episode = {
  id: 'ep01',
  season: 1,
  episode: 1,
  title: 'First Day Jitters',
  titleKr: '첫 출근',
  date: '2026-05-21',
  status: 'active',
  progress: 0,
  expressions: getEpisodeExpressions('ep01'),
}

// Re-export curriculum helpers for convenience
export { getCurriculumEpisode, getEpisodeExpressions }
