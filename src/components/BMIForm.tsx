'use client'

import { useState } from 'react'
import { saveBMI } from '@/app/actions'

export default function BMIForm() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState<{ bmi: number; category: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!height || !weight) return
    const res = await saveBMI(parseFloat(height), parseFloat(weight))
    setResult(res)
    setHeight('')
    setWeight('')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-gray-900">
      <h2 className="text-xl font-bold mb-4">Calculate BMI</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
            required
            placeholder="e.g. 175"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
            required
            placeholder="e.g. 70"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calculate
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p className="text-lg font-semibold">BMI: {result.bmi}</p>
          <p className="text-gray-600">Category: {result.category}</p>
        </div>
      )}
    </div>
  )
}
