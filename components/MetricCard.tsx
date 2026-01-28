'use client'

interface MetricCardProps {
  title: string
  value: string | number
  icon?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export default function MetricCard({ title, value, icon, trend }: MetricCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>
    </div>
  )
}
