import { getBMIHistory, getMISReports } from './actions'
import BMIForm from '@/components/BMIForm'
import HistoryList from '@/components/HistoryList'
import MISReports from '@/components/MISReports'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { logout } from './auth.actions'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const history = await getBMIHistory()
  const reports = await getMISReports()

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">BMI Calculator</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {session.name}</span>
            <form action={logout}>
              <button type="submit" className="text-sm text-red-600 hover:text-red-800">
                Logout
              </button>
            </form>
          </div>
        </div>
        <BMIForm />
        <MISReports reports={reports} />
        <HistoryList history={history} />
      </div>
    </main>
  )
}
