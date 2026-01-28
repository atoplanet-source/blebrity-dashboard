'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import MetricCard from '@/components/MetricCard'
import DailyActiveUsers from '@/components/DailyActiveUsers'
import RetentionTable from '@/components/RetentionTable'
import Leaderboard from '@/components/Leaderboard'
import GamesChart from '@/components/GamesChart'
import HomeschooledStats from '@/components/HomeschooledStats'
import WhosThatStats from '@/components/WhosThatStats'
import EngagementMetrics from '@/components/EngagementMetrics'
import EventLog from '@/components/EventLog'
import {
  fetchAnalyticsEvents,
  calculateKeyMetrics,
  calculateDAU,
  calculateRetention,
  calculateLeaderboard,
  calculateGamesByType,
  calculateDailyGames,
  calculateQuestionAccuracy,
  calculateAnswerBreakdown,
  calculateCluesAnalysis,
  calculateCelebrityDifficulty,
  calculateEngagementMetrics,
  getRecentEvents,
  type AnalyticsEvent,
  type KeyMetrics,
  type DailyActiveUser,
  type RetentionCohort,
  type LeaderboardEntry,
  type GamesByType,
  type DailyGames,
  type QuestionAccuracy,
  type AnswerBreakdown,
  type CluesAnalysis,
  type CelebrityDifficulty,
  type EngagementMetrics as EngagementMetricsType,
  type RecentEvent,
} from '@/lib/queries'

const REFRESH_INTERVAL = 30000 // 30 seconds

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Data states
  const [keyMetrics, setKeyMetrics] = useState<KeyMetrics>({
    totalPlayers: 0,
    dau: 0,
    totalSessions: 0,
    totalGames: 0,
    totalPoints: 0,
  })
  const [dauData, setDauData] = useState<DailyActiveUser[]>([])
  const [retentionData, setRetentionData] = useState<RetentionCohort[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [gamesByType, setGamesByType] = useState<GamesByType>({
    whosthat: 0,
    homeschooled: 0,
  })
  const [dailyGames, setDailyGames] = useState<DailyGames[]>([])
  const [questionAccuracy, setQuestionAccuracy] = useState<QuestionAccuracy[]>(
    []
  )
  const [answerBreakdown, setAnswerBreakdown] = useState<AnswerBreakdown>({
    correct: 0,
    wrong: 0,
    timeout: 0,
  })
  const [cluesAnalysis, setCluesAnalysis] = useState<CluesAnalysis[]>([])
  const [celebrityDifficulty, setCelebrityDifficulty] = useState<
    CelebrityDifficulty[]
  >([])
  const [engagementMetrics, setEngagementMetrics] =
    useState<EngagementMetricsType>({
      leaderboardOpens: 0,
      statsCardFlips: 0,
      shareTaps: 0,
      avgSessionDuration: 0,
    })
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([])

  const processData = useCallback((events: AnalyticsEvent[]) => {
    setKeyMetrics(calculateKeyMetrics(events))
    setDauData(calculateDAU(events))
    setRetentionData(calculateRetention(events))
    setLeaderboard(calculateLeaderboard(events))
    setGamesByType(calculateGamesByType(events))
    setDailyGames(calculateDailyGames(events))
    setQuestionAccuracy(calculateQuestionAccuracy(events))
    setAnswerBreakdown(calculateAnswerBreakdown(events))
    setCluesAnalysis(calculateCluesAnalysis(events))
    setCelebrityDifficulty(calculateCelebrityDifficulty(events))
    setEngagementMetrics(calculateEngagementMetrics(events))
    setRecentEvents(getRecentEvents(events, 50))
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const events = await fetchAnalyticsEvents()
      processData(events)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [processData])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchData()
    }, REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [autoRefresh, fetchData])

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blebrity-red mx-auto mb-4"></div>
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Blebrity Analytics
          </h1>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={e => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300"
              />
              Auto-refresh
            </label>
            <button
              onClick={fetchData}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Key Metrics */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MetricCard
              title="Total Players"
              value={keyMetrics.totalPlayers}
              icon="👥"
            />
            <MetricCard
              title="Today's Active"
              value={keyMetrics.dau}
              icon="📊"
            />
            <MetricCard
              title="Total Sessions"
              value={keyMetrics.totalSessions}
              icon="🎯"
            />
            <MetricCard
              title="Total Games"
              value={keyMetrics.totalGames}
              icon="🎮"
            />
            <MetricCard
              title="Total Points"
              value={keyMetrics.totalPoints}
              icon="⭐"
            />
          </div>
        </section>

        {/* Daily Active Users */}
        <section>
          <DailyActiveUsers data={dauData} />
        </section>

        {/* Retention & Leaderboard */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RetentionTable data={retentionData} />
          <Leaderboard data={leaderboard} />
        </section>

        {/* Games Analysis */}
        <section>
          <GamesChart gamesByType={gamesByType} dailyGames={dailyGames} />
        </section>

        {/* Homeschooled Analysis */}
        <section>
          <HomeschooledStats
            questionAccuracy={questionAccuracy}
            answerBreakdown={answerBreakdown}
          />
        </section>

        {/* Who's That Analysis */}
        <section>
          <WhosThatStats
            cluesAnalysis={cluesAnalysis}
            celebrityDifficulty={celebrityDifficulty}
          />
        </section>

        {/* Engagement Metrics */}
        <section>
          <EngagementMetrics data={engagementMetrics} />
        </section>

        {/* Recent Events */}
        <section>
          <EventLog events={recentEvents} />
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-4 border-t border-gray-200">
          {lastUpdated && (
            <p>Last updated: {lastUpdated.toLocaleString()}</p>
          )}
        </footer>
      </main>
    </div>
  )
}
