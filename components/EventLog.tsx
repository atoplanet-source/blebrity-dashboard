'use client'

import type { RecentEvent } from '@/lib/queries'

interface EventLogProps {
  events: RecentEvent[]
}

function getEventBadgeColor(eventName: string): string {
  if (eventName.includes('session_start')) return 'bg-blue-100 text-blue-700'
  if (eventName.includes('session_end')) return 'bg-gray-100 text-gray-700'
  if (eventName.includes('whosthat')) return 'bg-red-100 text-red-700'
  if (eventName.includes('homeschooled')) return 'bg-orange-100 text-orange-700'
  if (eventName.includes('leaderboard')) return 'bg-purple-100 text-purple-700'
  if (eventName.includes('share')) return 'bg-green-100 text-green-700'
  return 'bg-gray-100 text-gray-700'
}

function formatEventName(eventName: string): string {
  return eventName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

export default function EventLog({ events }: EventLogProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Events
      </h3>
      {events.length > 0 ? (
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  Time
                </th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  Player
                </th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  Event
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-100"
                >
                  <td className="py-2 px-3 text-gray-500 whitespace-nowrap">
                    {event.createdAt}
                  </td>
                  <td className="py-2 px-3 text-gray-900 font-medium">
                    {event.displayName}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getEventBadgeColor(
                        event.eventName
                      )}`}
                    >
                      {formatEventName(event.eventName)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center text-gray-500">
          No events recorded yet
        </div>
      )}
    </div>
  )
}
