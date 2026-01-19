import { BMIHistory } from '@prisma/client'

export default function HistoryList({ history }: { history: BMIHistory[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-gray-900">
      <h2 className="text-xl font-bold mb-4">History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Height</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.height} cm</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.weight} kg</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.bmi}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.category}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No history yet. Calculate your BMI above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
