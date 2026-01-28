'use client'

import type { RetentionCohort } from '@/lib/queries'

interface RetentionTableProps {
  data: RetentionCohort[]
}

function getRetentionColor(value: number): string {
  if (value >= 80) return 'bg-green-500 text-white'
  if (value >= 60) return 'bg-green-400 text-white'
  if (value >= 40) return 'bg-green-300 text-gray-900'
  if (value >= 20) return 'bg-green-200 text-gray-900'
  if (value > 0) return 'bg-green-100 text-gray-900'
  return 'bg-gray-100 text-gray-400'
}

export default function RetentionTable({ data }: RetentionTableProps) {
  const days = ['Day 0', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Retention Cohorts
      </h3>
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  Cohort
                </th>
                <th className="text-center py-2 px-3 text-gray-500 font-medium">
                  Size
                </th>
                {days.map(day => (
                  <th
                    key={day}
                    className="text-center py-2 px-2 text-gray-500 font-medium"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.cohortDate} className="border-b border-gray-100">
                  <td className="py-2 px-3 text-gray-900 font-medium">
                    {new Date(row.cohortDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="text-center py-2 px-3 text-gray-600">
                    {row.cohortSize}
                  </td>
                  {[
                    row.day0,
                    row.day1,
                    row.day2,
                    row.day3,
                    row.day4,
                    row.day5,
                    row.day6,
                    row.day7,
                  ].map((value, i) => (
                    <td key={i} className="py-2 px-2">
                      <div
                        className={`text-center py-1 px-2 rounded ${getRetentionColor(
                          value
                        )}`}
                      >
                        {value}%
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center text-gray-500">
          Not enough data for retention analysis
        </div>
      )}
    </div>
  )
}
