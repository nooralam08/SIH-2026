import {
  ArrowLeft,
  Apple,
  Brain,
  CircleHelp,
  Flower2,
  Hash,
  House,
  Images,
  Link2,
  LockKeyhole,
  Sparkles,
  CupSoda,
  Volume2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { getNextDifficulty } from './utils/adaptiveDifficulty'
import { getRecommendedActivity } from './utils/activityRecommendation'

const memoryItemPool = [
  { id: 'flower', name: 'Flower', Icon: Flower2 },
  { id: 'apple', name: 'Apple', Icon: Apple },
  { id: 'cup', name: 'Cup', Icon: CupSoda },
  { id: 'house', name: 'House', Icon: House },
  { id: 'book', name: 'Book', Icon: Images },
  { id: 'star', name: 'Star', Icon: Brain },
  { id: 'leaf', name: 'Leaf', Icon: Flower2 },
  { id: 'ball', name: 'Ball', Icon: Brain },
]

const difficultySettings = {
  easy: { targetCount: 3, choiceCount: 4 },
  medium: { targetCount: 4, choiceCount: 6 },
  hard: { targetCount: 5, choiceCount: 8 },
}

function getRoundItems(difficulty) {
  const settings = difficultySettings[difficulty] || difficultySettings.easy
  const targetItems = memoryItemPool.slice(0, settings.targetCount)
  return {
    targetItems,
    answerItems: memoryItemPool.slice(0, settings.choiceCount),
  }
}
const progressStorageKey = 'mindcare-prototype-progress'
const difficultyStorageKey = 'mindcare-memory-match-difficulty'
const activityHistoryStorageKey = 'mindcare-activity-history'

const activities = [
  {
    name: 'Memory Match',
    description: 'Remember and match familiar pictures.',
    Icon: Images,
    active: true,
  },
  {
    name: 'Picture Recall',
    description: 'Look carefully and remember what you see.',
    Icon: Brain,
    active: false,
  },
  {
    name: 'Number Recall',
    description: 'Remember a short sequence of numbers.',
    Icon: Hash,
    active: false,
  },
  {
    name: 'Word Association',
    description: 'Connect familiar words and ideas.',
    Icon: Link2,
    active: false,
  },
]

function LandingPage() {
  return (
    <section className="landing-page" aria-labelledby="landing-title">
      <p className="section-kicker">Welcome</p>
      <h1 id="landing-title">MindCare NER</h1>
      <p className="subtitle">Simple, supportive activities for everyday wellbeing.</p>
      <a className="start-game-button" href="#patient-login">Patient Login</a>
    </section>
  )
}

function PatientLogin() {
  return (
    <section className="login-page" aria-labelledby="login-title">
      <p className="section-kicker">Patient portal</p>
      <h1 id="login-title">Patient Login</h1>
      <p className="subtitle">Welcome. Continue to your Patient Dashboard.</p>
      <a className="start-game-button" href="#patient-dashboard">Continue</a>
    </section>
  )
}

function Logo() {
  return (
    <a className="brand" href="/" aria-label="MindCare NER home">
      <span className="brand-mark" aria-hidden="true">
        <Brain size={24} strokeWidth={2.5} />
      </span>
      <span>
        MindCare <strong>NER</strong>
      </span>
    </a>
  )
}

function ActivityCard({ activity }) {
  const { Icon } = activity

  if (activity.active) {
    return (
      <a className="activity-card activity-card-active" href="#memory-match">
        <span className="activity-icon" aria-hidden="true">
          <Icon size={34} strokeWidth={2} />
        </span>
        <span className="activity-content">
          <span className="activity-name">{activity.name}</span>
          <span className="activity-description">{activity.description}</span>
        </span>
        <span className="start-label">Start activity</span>
      </a>
    )
  }

  return (
    <div className="activity-card activity-card-disabled" aria-disabled="true">
      <span className="activity-icon" aria-hidden="true">
        <Icon size={34} strokeWidth={2} />
      </span>
      <span className="activity-content">
        <span className="activity-name">{activity.name}</span>
        <span className="activity-description">{activity.description}</span>
      </span>
      <span className="coming-soon">
        <LockKeyhole size={16} aria-hidden="true" />
        Coming Soon
      </span>
    </div>
  )
}

function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav className="primary-nav" aria-label="Main navigation">
          <a className="nav-link nav-link-active" href="/">
            Home
          </a>
          <a className="nav-link" href="#help">
            <CircleHelp size={20} aria-hidden="true" />
            Help
          </a>
          <button className="voice-button" type="button" aria-label="Voice assistance">
            <Volume2 size={20} aria-hidden="true" />
            Voice
          </button>
        </nav>
      </div>
    </header>
  )
}

function Breadcrumb({ instructions = false, game = false }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span aria-hidden="true">→</span>
      <a href="#patient-dashboard">Patient Dashboard</a>
      <span aria-hidden="true">→</span>
      <a href="#brain-games">Brain Games</a>
      {(instructions || game) && (
        <>
          <span aria-hidden="true">→</span>
          <span aria-current="page">{game ? 'Memory Match' : 'Instructions'}</span>
        </>
      )}
      {game && (
        <>
          <span aria-hidden="true">→</span>
          <span aria-current="page">Game</span>
        </>
      )}
    </nav>
  )
}

function BrainGamesPage() {
  return (
    <>
      <Breadcrumb />
      <section className="intro" aria-labelledby="page-title">
        <p className="section-kicker">Patient activities</p>
        <h1 id="page-title">Brain Games</h1>
        <p className="subtitle">Choose an activity to exercise your mind.</p>
      </section>

      <section className="activities" aria-label="Brain game activities">
        {activities.map((activity) => (
          <ActivityCard key={activity.name} activity={activity} />
        ))}
      </section>

      <a className="back-link" href="#patient-dashboard">
        <ArrowLeft size={22} strokeWidth={2.5} aria-hidden="true" />
        Back to Dashboard
      </a>
    </>
  )
}

function PatientDashboard({ completedActivities, recommendedActivity }) {
  const totalActivities = 4
  const progressPercent = (completedActivities / totalActivities) * 100
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(now)

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">→</span>
        <span aria-current="page">Patient Dashboard</span>
      </nav>
      <section className="dashboard-intro" aria-labelledby="dashboard-title">
        <p className="section-kicker">Your day</p>
        <h1 id="dashboard-title">Patient Dashboard</h1>
        <p className="dashboard-greeting">{greeting}</p>
        <p className="dashboard-date">{date}</p>
        <p className="subtitle">Welcome back. Choose an activity when you are ready.</p>
      </section>
      <section className="progress-card" aria-labelledby="progress-title">
        <div className="progress-heading">
          <div>
            <p className="section-kicker">Today</p>
            <h2 id="progress-title">Today's Progress</h2>
          </div>
          <strong>{completedActivities} of {totalActivities} activities completed</strong>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Today's activities completed"
          aria-valuemin="0"
          aria-valuemax={totalActivities}
          aria-valuenow={completedActivities}
        >
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <p className="progress-message">
          {completedActivities > 0
            ? 'Nice work. Every small step counts.'
            : 'You can take your time and start with one activity.'}
        </p>
      </section>
      <a className="dashboard-action" href="#brain-games">Explore Brain Games</a>
      <section className="today-activity-card" aria-labelledby="today-activity-title">
        <p className="section-kicker">⭐ Today's Activity</p>
        <h2 id="today-activity-title">{recommendedActivity.name}</h2>
        <p>{recommendedActivity.description}</p>
        <a className="start-game-button" href={recommendedActivity.href}>Start Activity</a>
      </section>
    </>
  )
}

function ComingSoonActivity() {
  return (
    <>
      <Breadcrumb />
      <section className="instructions" aria-labelledby="coming-soon-title">
        <p className="section-kicker">Patient activities</p>
        <h1 id="coming-soon-title">Picture Recall</h1>
        <p className="subtitle">This activity is coming soon.</p>
        <div className="instruction-panel">
          <h2>Choose another activity</h2>
          <p className="game-help">Memory Match is ready whenever you are.</p>
          <a className="start-game-button" href="#memory-match">Memory Match</a>
        </div>
      </section>
    </>
  )
}

function MemoryMatchInstructions() {
  return (
    <>
      <Breadcrumb instructions />
      <section className="instructions" aria-labelledby="instructions-title">
        <p className="section-kicker">Memory Match</p>
        <h1 id="instructions-title">Memory Match</h1>
        <p className="subtitle">Let's play a simple memory activity.</p>

        <div className="instruction-panel">
          <h2>How to play</h2>
          <ol className="instruction-list">
            <li>Look carefully at the pictures.</li>
            <li>Try to remember them.</li>
            <li>Then choose the pictures you saw.</li>
          </ol>
        </div>

        <div className="instruction-actions">
          <a className="start-game-button" href="#memory-match-game">
            Start Game
          </a>
          <a className="back-link" href="#brain-games">
            <ArrowLeft size={22} strokeWidth={2.5} aria-hidden="true" />
            Back
          </a>
        </div>
      </section>
    </>
  )
}

function Picture({ item, selected = false, onClick, disabled = false }) {
  const { Icon } = item

  return (
    <button
      className={`picture-card${selected ? ' picture-card-selected' : ''}`}
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="picture-icon" aria-hidden="true">
        <Icon size={58} strokeWidth={1.8} />
      </span>
      <span className="picture-name">{item.name}</span>
    </button>
  )
}

function MemoryMatchGame({ difficulty, attempts, recentPerformance, onSessionComplete }) {
  const { targetItems, answerItems } = getRoundItems(difficulty)
  const [phase, setPhase] = useState('viewing')
  const [selected, setSelected] = useState([])
  const [result, setResult] = useState(null)
  const [startedAt, setStartedAt] = useState(null)

  useEffect(() => {
    const started = Date.now()
    setStartedAt(started)
    const transition = window.setTimeout(() => setPhase('recall'), 4000)
    return () => window.clearTimeout(transition)
  }, [])

  const toggleSelection = (id) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const submitAnswers = () => {
    const correctAnswers = targetItems.filter((item) => selected.includes(item.id)).length
    const correct = correctAnswers === targetItems.length && selected.length === targetItems.length
    const responseTime = startedAt ? Math.round((Date.now() - startedAt) / 1000) : null
    const accuracy = correctAnswers / targetItems.length
    const updatedPerformance = [
      ...recentPerformance,
      { accuracy, responseTime: responseTime || 0 },
    ]
    const nextDifficulty = getNextDifficulty({
      accuracy,
      attempts: attempts + 1,
      responseTime: responseTime || 0,
      currentDifficulty: difficulty,
      recentPerformance,
    })
    onSessionComplete({
      nextDifficulty,
      performance: {
        accuracy,
        responseTime: responseTime || 0,
        correctAnswers,
        incorrectAnswers: targetItems.length - correctAnswers,
        questions: targetItems.length,
      },
      recentPerformance: updatedPerformance,
    })
    setResult({
      correct,
      correctAnswers,
      responseTime,
    })
    setPhase('result')
  }

  return (
    <>
      <Breadcrumb game />
      <section className="memory-game" aria-live="polite" aria-labelledby="game-title">
        <p className="section-kicker">Memory Match</p>
        <h1 id="game-title">Memory Match</h1>
        {phase === 'viewing' && (
          <>
            <p className="subtitle">Look carefully at these pictures.</p>
            <div className="picture-grid picture-grid-viewing">
              {targetItems.map((item) => <Picture key={item.id} item={item} disabled />)}
            </div>
          </>
        )}
        {phase === 'recall' && (
          <>
            <p className="subtitle">Which pictures did you see?</p>
            <p className="game-help">Select all the pictures you remember, then submit.</p>
            <div className="picture-grid">
              {answerItems.map((item) => (
                <Picture
                  key={item.id}
                  item={item}
                  selected={selected.includes(item.id)}
                  onClick={() => toggleSelection(item.id)}
                />
              ))}
            </div>
            <button className="submit-game-button" type="button" onClick={submitAnswers}>
              Submit
            </button>
          </>
        )}
        {phase === 'result' && result && (
          <div className="result-panel">
            <span className="result-icon" aria-hidden="true">
              <Sparkles size={34} />
            </span>
            <h2>Well Done!</h2>
            <p>You completed today's activity.</p>
            <div className="result-details">
              <strong>Activity completed</strong>
              <span>Correct answers: {result.correctAnswers} out of {targetItems.length}</span>
            </div>
            <div className="result-actions">
              <a className="start-game-button" href="#patient-dashboard">
                Continue
              </a>
              <a className="result-home-link" href="#patient-dashboard">
                Back to Home
              </a>
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default function App() {
  const getPage = () => {
    if (window.location.hash === '#patient-login') return 'login'
    if (window.location.hash === '#patient-dashboard') return 'dashboard'
    if (window.location.hash === '#picture-recall') return 'picture-recall'
    if (window.location.hash === '#memory-match-game') return 'game'
    if (window.location.hash === '#memory-match') return 'instructions'
    if (window.location.hash === '#brain-games') return 'brain-games'
    return 'landing'
  }
  const [page, setPage] = useState(getPage)
  const [completedActivities, setCompletedActivities] = useState(() => {
    const savedProgress = Number(window.localStorage.getItem(progressStorageKey))
    return Number.isInteger(savedProgress) && savedProgress >= 0 && savedProgress <= 4 ? savedProgress : 0
  })
  const [memoryDifficulty, setMemoryDifficulty] = useState(() => {
    const savedDifficulty = window.sessionStorage.getItem(difficultyStorageKey)
    return Object.prototype.hasOwnProperty.call(difficultySettings, savedDifficulty)
      ? savedDifficulty
      : 'easy'
  })
  const [memoryStats, setMemoryStats] = useState({
    attempts: 0,
    correct: 0,
    incorrect: 0,
    questions: 0,
    responseTimes: [],
    recentPerformance: [],
  })
  const [activityHistory, setActivityHistory] = useState(() => {
    try {
      const saved = JSON.parse(window.sessionStorage.getItem(activityHistoryStorageKey) || '[]')
      return Array.isArray(saved) ? saved : []
    } catch {
      return []
    }
  })
  const recommendedActivity = getRecommendedActivity({
    history: activityHistory,
    currentDifficulty: memoryDifficulty,
    recentPerformance: memoryStats.recentPerformance,
  })

  useEffect(() => {
    const handleHashChange = () => {
      setPage(getPage())
      const savedProgress = Number(window.localStorage.getItem(progressStorageKey))
      if (Number.isInteger(savedProgress) && savedProgress >= 0 && savedProgress <= 4) {
        setCompletedActivities(savedProgress)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className="app-shell">
      <SiteHeader />

      <main className="page-content">
        <div className="content-width">
          {page === 'landing' && <LandingPage />}
          {page === 'login' && <PatientLogin />}
          {page === 'instructions' && <MemoryMatchInstructions />}
          {page === 'game' && (
            <MemoryMatchGame
              difficulty={memoryDifficulty}
              attempts={memoryStats.attempts}
              recentPerformance={memoryStats.recentPerformance}
              onSessionComplete={({ nextDifficulty, performance, recentPerformance }) => {
                setMemoryDifficulty(nextDifficulty)
                setMemoryStats((current) => ({
                  attempts: current.attempts + 1,
                  correct: current.correct + performance.correctAnswers,
                  incorrect: current.incorrect + performance.incorrectAnswers,
                  questions: current.questions + performance.questions,
                  responseTimes: [...current.responseTimes, performance.responseTime],
                  recentPerformance,
                }))
                setActivityHistory((current) => {
                  const updated = [...current, { id: 'memory-match', completedAt: Date.now() }]
                  window.sessionStorage.setItem(activityHistoryStorageKey, JSON.stringify(updated))
                  return updated
                })
                window.sessionStorage.setItem(difficultyStorageKey, nextDifficulty)
                window.localStorage.setItem(progressStorageKey, '1')
              }}
            />
          )}
          {page === 'brain-games' && <BrainGamesPage />}
          {page === 'dashboard' && (
            <PatientDashboard
              completedActivities={completedActivities}
              recommendedActivity={recommendedActivity}
            />
          )}
          {page === 'picture-recall' && <ComingSoonActivity />}
        </div>
      </main>
    </div>
  )
}
