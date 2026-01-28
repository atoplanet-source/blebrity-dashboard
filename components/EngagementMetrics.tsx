'use client'

import type { EngagementMetrics as EngagementMetricsType } from '@/lib/queries'

interface EngagementMetricsProps {
  data: EngagementMetricsType
}

export default function EngagementMetrics({ data }: EngagementMetricsProps) {
  const metrics = [
    {
      label: 'Leaderboard Opens',
      value: data.leaderboardOpens,
      icon: '🏆',
    },
    {
      label: 'Stats Card Flips',
      value: data.statsCardFlips,
      icon: '🔄',
    },
    {
      label: 'Share Taps',
      value: data.shareTaps,
      icon: '📤',
    },
    {
      label: 'Avg Session Duration',
      value: `${data.avgSessionDuration}s`,
      icon: '⏱️',
    },
  ]

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Engagement Metrics
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(metric => (
          <div
            key={metric.label}
            className="bg-white rounded-lg p-4 border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{metric.icon}</span>
              <span className="text-sm text-gray-500">{metric.label}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {typeof metric.value === 'number'
                ? metric.value.toLocaleString()
                : metric.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
