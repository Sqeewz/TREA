'use client'

import { useState } from 'react'
import { generateMockData } from '@/app/actions'

type ReportData = {
  date: string
  count: number
  avgBMI: number
}[]

type Props = {
  reports: {
    daily: ReportData
    weekly: ReportData
    monthly: ReportData
    yearly: ReportData
  }
}

export default function MISReports({ reports }: Props) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    await generateMockData()
    setIsGenerating(false)
  }

  const data = reports[activeTab]

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-gray-900 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">MIS Reports</h2>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded"
        >
          {isGenerating ? 'Generating...' : 'Generate Mock Data (50)'}
        </button>
      </div>

      <div className="flex space-x-2 mb-4 border-b">
        {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 ${
              activeTab === tab
                ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg BMI</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={row.date}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.avgBMI}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  No data available for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
