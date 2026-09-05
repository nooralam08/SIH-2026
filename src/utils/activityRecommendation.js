/**
 * Selects a gentle next activity from frontend-only session history.
 * Recent variety is preferred, while repeated low performance keeps practice
 * on the same activity. This boundary can later be replaced by an AI service.
 */
const activities = [
  { id: 'memory-match', name: 'Memory Match', description: "Let's try a simple memory activity.", href: '#memory-match' },
  { id: 'picture-recall', name: 'Picture Recall', description: "Let's look carefully and remember what you see.", href: '#picture-recall' },
]

export function getRecommendedActivity({ history = [], currentDifficulty = 'easy', recentPerformance = [] }) {
  const last = history.at(-1)
  const lastPerformance = recentPerformance.at(-1)
  const needsPractice = last?.id === 'memory-match' &&
    (lastPerformance?.accuracy ?? 1) < 0.5

  if (needsPractice || currentDifficulty === 'easy' && last?.id !== 'memory-match') {
    return activities[0]
  }

  return activities.find((activity) => activity.id !== last?.id) || activities[0]
}
