import { getBMIHistory, getMISReports } from './actions'
import BMIForm from '@/components/BMIForm'
import HistoryList from '@/components/HistoryList'
import MISReports from '@/components/MISReports'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const history = await getBMIHistory()
  const reports = await getMISReports()

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">BMI Calculator</h1>
        <BMIForm />
        <MISReports reports={reports} />
        <HistoryList history={history} />
      </div>
    </main>
  )
}
