'use client'

import { useState } from 'react'
import type { LeaderboardEntry } from '@/lib/queries'

interface LeaderboardProps {
  data: LeaderboardEntry[]
}

type SortKey = 'totalPoints' | 'gamesPlayed' | 'avgPointsPerGame'

export default function Leaderboard({ data }: LeaderboardProps) {
  const [sortKey, setSortKey] = useState<SortKey>('totalPoints')
  const [sortAsc, setSortAsc] = useState(false)

  const sortedData = [...data].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey]
    return sortAsc ? diff : -diff
  })

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  function SortIndicator({ columnKey }: { columnKey: SortKey }) {
    if (columnKey !== sortKey) return null
    return <span className="ml-1">{sortAsc ? '↑' : '↓'}</span>
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Points Leaderboard
      </h3>
      {sortedData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  #
                </th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  Player
                </th>
                <th
                  className="text-right py-2 px-3 text-gray-500 font-medium cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('totalPoints')}
                >
                  Points
                  <SortIndicator columnKey="totalPoints" />
                </th>
                <th
                  className="text-right py-2 px-3 text-gray-500 font-medium cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('gamesPlayed')}
                >
                  Games
                  <SortIndicator columnKey="gamesPlayed" />
                </th>
                <th
                  className="text-right py-2 px-3 text-gray-500 font-medium cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('avgPointsPerGame')}
                >
                  Avg
                  <SortIndicator columnKey="avgPointsPerGame" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.slice(0, 20).map((entry, index) => (
                <tr
                  key={entry.player}
                  className="border-b border-gray-100 hover:bg-gray-100"
                >
                  <td className="py-2 px-3 text-gray-400">{index + 1}</td>
                  <td className="py-2 px-3 text-gray-900 font-medium">
                    {entry.player}
                  </td>
                  <td className="py-2 px-3 text-right text-blebrity-red font-semibold">
                    {entry.totalPoints.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right text-gray-600">
                    {entry.gamesPlayed}
                  </td>
                  <td className="py-2 px-3 text-right text-gray-600">
                    {entry.avgPointsPerGame}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center text-gray-500">
          No games completed yet
        </div>
      )}
    </div>
  )
}
