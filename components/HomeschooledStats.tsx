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
  PieChart,
  Pie,
} from 'recharts'
import type { QuestionAccuracy, AnswerBreakdown } from '@/lib/queries'

interface HomeschooledStatsProps {
  questionAccuracy: QuestionAccuracy[]
  answerBreakdown: AnswerBreakdown
}

const BREAKDOWN_COLORS = {
  correct: '#34C759',
  wrong: '#FF3B30',
  timeout: '#FF9500',
}

function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 80) return '#34C759'
  if (accuracy >= 60) return '#4ADE80'
  if (accuracy >= 40) return '#FCD34D'
  if (accuracy >= 20) return '#FB923C'
  return '#FF3B30'
}

export default function HomeschooledStats({
  questionAccuracy,
  answerBreakdown,
}: HomeschooledStatsProps) {
  const pieData = [
    { name: 'Correct', value: answerBreakdown.correct },
    { name: 'Wrong', value: answerBreakdown.wrong },
    { name: 'Timeout', value: answerBreakdown.timeout },
  ].filter(d => d.value > 0)

  const totalAnswers =
    answerBreakdown.correct + answerBreakdown.wrong + answerBreakdown.timeout
  const hasData = totalAnswers > 0

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Homeschooled Analysis
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Accuracy */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Accuracy by Question Position
          </h4>
          <div className="h-48">
            {questionAccuracy.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={questionAccuracy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="questionNumber"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    label={{
                      value: 'Question #',
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
                      value: 'Accuracy %',
                      angle: -90,
                      position: 'insideLeft',
                      fontSize: 12,
                      fill: '#6b7280',
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Accuracy']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                    {questionAccuracy.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getAccuracyColor(entry.accuracy)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No questions answered yet
              </div>
            )}
          </div>
        </div>

        {/* Answer Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Answer Breakdown
          </h4>
          <div className="h-48">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
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
                          BREAKDOWN_COLORS[
                            entry.name.toLowerCase() as keyof typeof BREAKDOWN_COLORS
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No answer data yet
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: BREAKDOWN_COLORS.correct }}
              />
              <span className="text-xs text-gray-600">
                Correct ({answerBreakdown.correct})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: BREAKDOWN_COLORS.wrong }}
              />
              <span className="text-xs text-gray-600">
                Wrong ({answerBreakdown.wrong})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: BREAKDOWN_COLORS.timeout }}
              />
              <span className="text-xs text-gray-600">
                Timeout ({answerBreakdown.timeout})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
