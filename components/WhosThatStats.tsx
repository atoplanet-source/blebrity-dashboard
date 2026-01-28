'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import type { CluesAnalysis, CelebrityDifficulty } from '@/lib/queries'

interface WhosThatStatsProps {
  cluesAnalysis: CluesAnalysis[]
  celebrityDifficulty: CelebrityDifficulty[]
}

function getWinRateColor(winRate: number): string {
  if (winRate >= 80) return '#34C759'
  if (winRate >= 60) return '#4ADE80'
  if (winRate >= 40) return '#FCD34D'
  if (winRate >= 20) return '#FB923C'
  return '#FF3B30'
}

export default function WhosThatStats({
  cluesAnalysis,
  celebrityDifficulty,
}: WhosThatStatsProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Who&apos;s That Analysis
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win Rate by Clues Used */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Win Rate by Clues Used
          </h4>
          <div className="h-48">
            {cluesAnalysis.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cluesAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="cluesUsed"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    label={{
                      value: 'Clues Used',
                      position: 'insideBottom',
                      offset: -5,
                      fontSize: 12,
                      fill: '#6b7280',
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    domain={[0, 100]}
                    label={{
                      value: 'Win Rate %',
                      angle: -90,
                      position: 'insideLeft',
                      fontSize: 12,
                      fill: '#6b7280',
                    }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'winRate') return [`${value}%`, 'Win Rate']
                      return [value, name]
                    }}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
                    {cluesAnalysis.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getWinRateColor(entry.winRate)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No Who&apos;s That games completed yet
              </div>
            )}
          </div>
          {cluesAnalysis.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {cluesAnalysis.map(c => (
                <span
                  key={c.cluesUsed}
                  className="text-xs px-2 py-1 bg-white border border-gray-200 rounded"
                >
                  {c.cluesUsed} clues: {c.total} games
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hardest Celebrities */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Hardest Celebrities
          </h4>
          {celebrityDifficulty.length > 0 ? (
            <div className="overflow-y-auto max-h-64">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-gray-500 font-medium">
                      Celebrity
                    </th>
                    <th className="text-right py-2 px-2 text-gray-500 font-medium">
                      Win%
                    </th>
                    <th className="text-right py-2 px-2 text-gray-500 font-medium">
                      Avg Clues
                    </th>
                    <th className="text-right py-2 px-2 text-gray-500 font-medium">
                      Games
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {celebrityDifficulty.map(celeb => (
                    <tr
                      key={celeb.celebrity}
                      className="border-b border-gray-100"
                    >
                      <td className="py-2 px-2 text-gray-900 truncate max-w-[120px]">
                        {celeb.celebrity}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            celeb.winRate < 30
                              ? 'bg-red-100 text-red-700'
                              : celeb.winRate < 60
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {celeb.winRate}%
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right text-gray-600">
                        {celeb.avgClues}
                      </td>
                      <td className="py-2 px-2 text-right text-gray-600">
                        {celeb.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              No celebrity data yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
