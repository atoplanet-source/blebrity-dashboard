import { getSupabase } from './supabase'

export interface AnalyticsEvent {
  id: string
  user_id: string
  display_name: string | null
  event_name: string
  event_data: Record<string, unknown>
  created_at: string
}

interface RawAnalyticsEvent {
  id: string
  user_id: string
  display_name: string | null
  event_name: string
  event_data: string | Record<string, unknown>
  created_at: string
}

export interface KeyMetrics {
  totalPlayers: number
  dau: number
  totalSessions: number
  totalGames: number
  totalPoints: number
}

export interface DailyActiveUser {
  date: string
  users: number
}

export interface RetentionCohort {
  cohortDate: string
  day0: number
  day1: number
  day2: number
  day3: number
  day4: number
  day5: number
  day6: number
  day7: number
  cohortSize: number
}

export interface LeaderboardEntry {
  player: string
  totalPoints: number
  gamesPlayed: number
  avgPointsPerGame: number
}

export interface GamesByType {
  whosthat: number
  homeschooled: number
}

export interface DailyGames {
  date: string
  whosthat: number
  homeschooled: number
}

export interface QuestionAccuracy {
  questionNumber: number
  correct: number
  total: number
  accuracy: number
}

export interface AnswerBreakdown {
  correct: number
  wrong: number
  timeout: number
}

export interface CluesAnalysis {
  cluesUsed: number
  wins: number
  total: number
  winRate: number
}

export interface CelebrityDifficulty {
  celebrity: string
  wins: number
  total: number
  winRate: number
  avgClues: number
}

export interface EngagementMetrics {
  leaderboardOpens: number
  statsCardFlips: number
  shareTaps: number
  avgSessionDuration: number
}

export interface RecentEvent {
  createdAt: string
  displayName: string
  eventName: string
}

// Fetch all analytics events
export async function fetchAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  try {
    const supabase = getSupabase()
    console.log('Fetching analytics events...')

    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return []
    }

    console.log('Fetched', data?.length || 0, 'events')

    // Parse event_data if it's a string (Supabase stores it as text)
    const events: AnalyticsEvent[] = (data as RawAnalyticsEvent[] || []).map(event => ({
      ...event,
      event_data: typeof event.event_data === 'string'
        ? JSON.parse(event.event_data)
        : (event.event_data || {})
    }))

    return events
  } catch (err) {
    console.error('Failed to fetch analytics:', err)
    return []
  }
}

// Process events into key metrics
export function calculateKeyMetrics(events: AnalyticsEvent[]): KeyMetrics {
  const today = new Date().toISOString().split('T')[0]

  const uniqueUsers = new Set(events.map(e => e.user_id))
  const todayEvents = events.filter(e => e.created_at.split('T')[0] === today)
  const todayUsers = new Set(todayEvents.map(e => e.user_id))

  const sessionStarts = events.filter(e => e.event_name === 'session_start')
  const gameCompleted = events.filter(e =>
    e.event_name === 'whosthat_game_completed' ||
    e.event_name === 'homeschooled_game_completed'
  )

  const totalPoints = gameCompleted.reduce((sum, e) => {
    const points = (e.event_data?.points_earned as number) || 0
    return sum + points
  }, 0)

  return {
    totalPlayers: uniqueUsers.size,
    dau: todayUsers.size,
    totalSessions: sessionStarts.length,
    totalGames: gameCompleted.length,
    totalPoints
  }
}

// Calculate daily active users
export function calculateDAU(events: AnalyticsEvent[]): DailyActiveUser[] {
  const sessionStarts = events.filter(e => e.event_name === 'session_start')

  const usersByDate: Record<string, Set<string>> = {}

  sessionStarts.forEach(e => {
    const date = e.created_at.split('T')[0]
    if (!usersByDate[date]) {
      usersByDate[date] = new Set()
    }
    usersByDate[date].add(e.user_id)
  })

  return Object.entries(usersByDate)
    .map(([date, users]) => ({ date, users: users.size }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Calculate retention cohorts
export function calculateRetention(events: AnalyticsEvent[]): RetentionCohort[] {
  const sessionStarts = events.filter(e => e.event_name === 'session_start')

  // Get first session date for each user
  const firstSession: Record<string, string> = {}
  sessionStarts.forEach(e => {
    const date = e.created_at.split('T')[0]
    if (!firstSession[e.user_id] || date < firstSession[e.user_id]) {
      firstSession[e.user_id] = date
    }
  })

  // Get all session dates per user
  const userSessions: Record<string, Set<string>> = {}
  sessionStarts.forEach(e => {
    const date = e.created_at.split('T')[0]
    if (!userSessions[e.user_id]) {
      userSessions[e.user_id] = new Set()
    }
    userSessions[e.user_id].add(date)
  })

  // Group users by cohort (first session date)
  const cohorts: Record<string, string[]> = {}
  Object.entries(firstSession).forEach(([userId, date]) => {
    if (!cohorts[date]) {
      cohorts[date] = []
    }
    cohorts[date].push(userId)
  })

  // Calculate retention for each cohort
  return Object.entries(cohorts)
    .map(([cohortDate, users]) => {
      const cohortSize = users.length
      const dayRetention = [0, 0, 0, 0, 0, 0, 0, 0] // Day 0-7

      users.forEach(userId => {
        const sessions = userSessions[userId]
        const cohortDateObj = new Date(cohortDate)

        for (let day = 0; day <= 7; day++) {
          const checkDate = new Date(cohortDateObj)
          checkDate.setDate(checkDate.getDate() + day)
          const checkDateStr = checkDate.toISOString().split('T')[0]

          if (sessions.has(checkDateStr)) {
            dayRetention[day]++
          }
        }
      })

      return {
        cohortDate,
        day0: Math.round((dayRetention[0] / cohortSize) * 100),
        day1: Math.round((dayRetention[1] / cohortSize) * 100),
        day2: Math.round((dayRetention[2] / cohortSize) * 100),
        day3: Math.round((dayRetention[3] / cohortSize) * 100),
        day4: Math.round((dayRetention[4] / cohortSize) * 100),
        day5: Math.round((dayRetention[5] / cohortSize) * 100),
        day6: Math.round((dayRetention[6] / cohortSize) * 100),
        day7: Math.round((dayRetention[7] / cohortSize) * 100),
        cohortSize
      }
    })
    .sort((a, b) => b.cohortDate.localeCompare(a.cohortDate))
    .slice(0, 10) // Show last 10 cohorts
}

// Calculate points leaderboard
export function calculateLeaderboard(events: AnalyticsEvent[]): LeaderboardEntry[] {
  const gameCompleted = events.filter(e =>
    e.event_name === 'whosthat_game_completed' ||
    e.event_name === 'homeschooled_game_completed'
  )

  const playerStats: Record<string, { points: number; games: number; name: string }> = {}

  gameCompleted.forEach(e => {
    const name = e.display_name || e.user_id.slice(0, 8)
    const points = (e.event_data?.points_earned as number) || 0

    if (!playerStats[e.user_id]) {
      playerStats[e.user_id] = { points: 0, games: 0, name }
    }
    playerStats[e.user_id].points += points
    playerStats[e.user_id].games++
    playerStats[e.user_id].name = name // Update to latest display name
  })

  return Object.values(playerStats)
    .map(({ name, points, games }) => ({
      player: name,
      totalPoints: points,
      gamesPlayed: games,
      avgPointsPerGame: Math.round(points / games * 10) / 10
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
}

// Calculate games by type
export function calculateGamesByType(events: AnalyticsEvent[]): GamesByType {
  const whosthat = events.filter(e => e.event_name === 'whosthat_game_completed').length
  const homeschooled = events.filter(e => e.event_name === 'homeschooled_game_completed').length

  return { whosthat, homeschooled }
}

// Calculate daily games
export function calculateDailyGames(events: AnalyticsEvent[]): DailyGames[] {
  const gameCompleted = events.filter(e =>
    e.event_name === 'whosthat_game_completed' ||
    e.event_name === 'homeschooled_game_completed'
  )

  const gamesByDate: Record<string, { whosthat: number; homeschooled: number }> = {}

  gameCompleted.forEach(e => {
    const date = e.created_at.split('T')[0]
    if (!gamesByDate[date]) {
      gamesByDate[date] = { whosthat: 0, homeschooled: 0 }
    }
    if (e.event_name === 'whosthat_game_completed') {
      gamesByDate[date].whosthat++
    } else {
      gamesByDate[date].homeschooled++
    }
  })

  return Object.entries(gamesByDate)
    .map(([date, games]) => ({ date, ...games }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Calculate question accuracy for Homeschooled
export function calculateQuestionAccuracy(events: AnalyticsEvent[]): QuestionAccuracy[] {
  const questions = events.filter(e => e.event_name === 'homeschooled_question_answered')

  const byQuestion: Record<number, { correct: number; total: number }> = {}

  questions.forEach(e => {
    const questionNumber = (e.event_data?.question_number as number) || 0
    const isCorrect = (e.event_data?.is_correct as boolean) || false

    if (questionNumber > 0) {
      if (!byQuestion[questionNumber]) {
        byQuestion[questionNumber] = { correct: 0, total: 0 }
      }
      byQuestion[questionNumber].total++
      if (isCorrect) {
        byQuestion[questionNumber].correct++
      }
    }
  })

  return Object.entries(byQuestion)
    .map(([num, stats]) => ({
      questionNumber: parseInt(num),
      correct: stats.correct,
      total: stats.total,
      accuracy: Math.round((stats.correct / stats.total) * 100)
    }))
    .sort((a, b) => a.questionNumber - b.questionNumber)
}

// Calculate answer breakdown (correct/wrong/timeout)
export function calculateAnswerBreakdown(events: AnalyticsEvent[]): AnswerBreakdown {
  const questions = events.filter(e => e.event_name === 'homeschooled_question_answered')
  const timeouts = events.filter(e => e.event_name === 'homeschooled_question_timeout')

  let correct = 0
  let wrong = 0

  questions.forEach(e => {
    const isCorrect = (e.event_data?.is_correct as boolean) || false
    if (isCorrect) {
      correct++
    } else {
      wrong++
    }
  })

  return { correct, wrong, timeout: timeouts.length }
}

// Calculate Who's That clues analysis
export function calculateCluesAnalysis(events: AnalyticsEvent[]): CluesAnalysis[] {
  const games = events.filter(e => e.event_name === 'whosthat_game_completed')

  const byClues: Record<number, { wins: number; total: number }> = {}

  games.forEach(e => {
    const cluesUsed = (e.event_data?.clues_used as number) || 0
    const won = (e.event_data?.won as boolean) || false

    if (!byClues[cluesUsed]) {
      byClues[cluesUsed] = { wins: 0, total: 0 }
    }
    byClues[cluesUsed].total++
    if (won) {
      byClues[cluesUsed].wins++
    }
  })

  return Object.entries(byClues)
    .map(([clues, stats]) => ({
      cluesUsed: parseInt(clues),
      wins: stats.wins,
      total: stats.total,
      winRate: Math.round((stats.wins / stats.total) * 100)
    }))
    .sort((a, b) => a.cluesUsed - b.cluesUsed)
}

// Calculate hardest celebrities
export function calculateCelebrityDifficulty(events: AnalyticsEvent[]): CelebrityDifficulty[] {
  const games = events.filter(e => e.event_name === 'whosthat_game_completed')

  const byCeleb: Record<string, { wins: number; total: number; cluesSum: number }> = {}

  games.forEach(e => {
    const answer = (e.event_data?.answer as string) || 'Unknown'
    const won = (e.event_data?.won as boolean) || false
    const cluesUsed = (e.event_data?.clues_used as number) || 0

    if (!byCeleb[answer]) {
      byCeleb[answer] = { wins: 0, total: 0, cluesSum: 0 }
    }
    byCeleb[answer].total++
    byCeleb[answer].cluesSum += cluesUsed
    if (won) {
      byCeleb[answer].wins++
    }
  })

  return Object.entries(byCeleb)
    .map(([celebrity, stats]) => ({
      celebrity,
      wins: stats.wins,
      total: stats.total,
      winRate: Math.round((stats.wins / stats.total) * 100),
      avgClues: Math.round((stats.cluesSum / stats.total) * 10) / 10
    }))
    .sort((a, b) => a.winRate - b.winRate)
    .slice(0, 10)
}

// Calculate engagement metrics
export function calculateEngagementMetrics(events: AnalyticsEvent[]): EngagementMetrics {
  const leaderboardOpens = events.filter(e => e.event_name === 'leaderboard_opened').length
  const statsCardFlips = events.filter(e => e.event_name === 'stats_card_flipped').length
  const shareTaps = events.filter(e => e.event_name === 'share_tapped').length

  const sessionEnds = events.filter(e => e.event_name === 'session_end')
  const totalDuration = sessionEnds.reduce((sum, e) => {
    const duration = (e.event_data?.session_duration_seconds as number) || 0
    return sum + duration
  }, 0)
  const avgSessionDuration = sessionEnds.length > 0
    ? Math.round(totalDuration / sessionEnds.length)
    : 0

  return { leaderboardOpens, statsCardFlips, shareTaps, avgSessionDuration }
}

// Get recent events
export function getRecentEvents(events: AnalyticsEvent[], limit = 50): RecentEvent[] {
  return events.slice(0, limit).map(e => ({
    createdAt: new Date(e.created_at).toLocaleString(),
    displayName: e.display_name || e.user_id.slice(0, 8),
    eventName: e.event_name
  }))
}
