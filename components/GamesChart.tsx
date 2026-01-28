'use client'

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { GamesByType, DailyGames } from '@/lib/queries'

interface GamesChartProps {
  gamesByType: GamesByType
  dailyGames: DailyGames[]
}

const COLORS = {
  whosthat: '#E63434',
  homeschooled: '#FF9500',
}

export default function GamesChart({ gamesByType, dailyGames }: GamesChartProps) {
  const pieData = [
    { name: "Who's That", value: gamesByType.whosthat },
    { name: 'Homeschooled', value: gamesByType.homeschooled },
  ].filter(d => d.value > 0)

  const barData = dailyGames.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  const hasData = gamesByType.whosthat > 0 || gamesByType.homeschooled > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Games by Type - Pie Chart */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Games by Type
        </h3>
        <div className="h-64">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === "Who's That"
                          ? COLORS.whosthat
                          : COLORS.homeschooled
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No games played yet
            </div>
          )}
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.whosthat }}
            />
            <span className="text-sm text-gray-600">
              Who&apos;s That ({gamesByType.whosthat})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.homeschooled }}
            />
            <span className="text-sm text-gray-600">
              Homeschooled ({gamesByType.homeschooled})
            </span>
          </div>
        </div>
      </div>

      {/* Games Over Time - Stacked Bar Chart */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Games Over Time
        </h3>
        <div className="h-64">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="whosthat"
                  name="Who's That"
                  stackId="a"
                  fill={COLORS.whosthat}
                />
                <Bar
                  dataKey="homeschooled"
                  name="Homeschooled"
                  stackId="a"
                  fill={COLORS.homeschooled}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No games played yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
