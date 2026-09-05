/**
 * Rule-based difficulty selection for cognitive-game prototypes.
 *
 * The engine changes difficulty by at most one level at a time. It uses the
 * current attempt plus a short recent-performance window so one unusual result
 * does not cause a sudden change. Accuracy is expected as a value from 0 to 1,
 * responseTime is in seconds, and recentPerformance contains the same fields.
 *
 * Strong performance (high accuracy and a reasonable response time) over
 * repeated attempts increases difficulty gradually. Moderate or mixed results
 * keep the current level. Repeated low accuracy or slow responses reduce the
 * level to provide a gentler next activity.
 */

const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard']
const PERFORMANCE_WINDOW = 3

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const normaliseDifficulty = (difficulty) =>
  DIFFICULTY_LEVELS.includes(difficulty) ? difficulty : 'easy'

const normalisePerformance = (performance) => ({
  accuracy: clamp(Number(performance?.accuracy) || 0, 0, 1),
  responseTime: Math.max(Number(performance?.responseTime) || 0, 0),
})

/**
 * Select the next difficulty without changing more than one level.
 *
 * @param {{
 *   accuracy: number,
 *   attempts: number,
 *   responseTime: number,
 *   currentDifficulty: 'easy'|'medium'|'hard',
 *   recentPerformance?: Array<{accuracy: number, responseTime: number}>
 * }} input
 * @returns {'easy'|'medium'|'hard'}
 */
export function getNextDifficulty({
  accuracy,
  attempts,
  responseTime,
  currentDifficulty,
  recentPerformance = [],
}) {
  const current = normaliseDifficulty(currentDifficulty)
  const currentIndex = DIFFICULTY_LEVELS.indexOf(current)
  const currentPerformance = normalisePerformance({ accuracy, responseTime })
  const recent = recentPerformance
    .slice(-PERFORMANCE_WINDOW)
    .map(normalisePerformance)
  const performanceWindow = [...recent, currentPerformance]
  const averageAccuracy =
    performanceWindow.reduce((sum, result) => sum + result.accuracy, 0) / performanceWindow.length
  const averageResponseTime =
    performanceWindow.reduce((sum, result) => sum + result.responseTime, 0) / performanceWindow.length
  const attemptCount = Math.max(Number(attempts) || 0, 0)

  const strongPerformance =
    attemptCount >= 2 && averageAccuracy >= 0.85 && averageResponseTime <= 12
  const repeatedDifficulty =
    performanceWindow.length >= 2 &&
    performanceWindow.filter((result) => result.accuracy < 0.5).length >= 2
  const needsSupport =
    averageAccuracy < 0.5 || (averageAccuracy < 0.7 && averageResponseTime > 20)

  if (strongPerformance) {
    return DIFFICULTY_LEVELS[Math.min(currentIndex + 1, DIFFICULTY_LEVELS.length - 1)]
  }

  if (repeatedDifficulty || needsSupport) {
    return DIFFICULTY_LEVELS[Math.max(currentIndex - 1, 0)]
  }

  return current
}

export const adaptiveDifficultyConfig = {
  difficultyLevels: [...DIFFICULTY_LEVELS],
  performanceWindow: PERFORMANCE_WINDOW,
}
