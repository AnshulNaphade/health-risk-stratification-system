import { historyApi } from '../services/api.js'
import { navigate } from '../components/router.js'

const RISK_BADGE = {
  LOW:      'bg-green-100 text-green-800',
  MODERATE: 'bg-yellow-100 text-yellow-800',
  HIGH:     'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
}

export const renderHistory = async (app) => {
  app.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 class="text-lg font-semibold text-gray-900">Assessment History</h1>
        <button id="new-btn" class="text-sm text-blue-600 hover:underline">New assessment</button>
      </nav>
      <div id="content" class="max-w-2xl mx-auto px-4 py-8">
        <div class="text-center text-gray-400 py-12">Loading history...</div>
      </div>
    </div>
  `

  document.getElementById('new-btn').addEventListener('click', () => navigate('/dashboard'))

  try {
    const res     = await historyApi.getAll()
    const history = res.data.data
    const content = document.getElementById('content')

    if (!history.length) {
      content.innerHTML = `
        <div class="text-center py-12">
          <p class="text-gray-400 mb-4">No assessments yet</p>
          <button id="start-btn"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">
            Start your first assessment
          </button>
        </div>
      `
      document.getElementById('start-btn').addEventListener('click', () => navigate('/dashboard'))
      return
    }

    content.innerHTML = `
      <div class="space-y-3">
        ${history.map(item => `
          <button data-id="${item.id}"
            class="history-item w-full bg-white border border-gray-200 rounded-xl p-4 text-left
                   hover:border-blue-300 hover:shadow-sm transition-all">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-xs font-medium px-2 py-1 rounded-full ${RISK_BADGE[item.riskLevel]}">
                  ${item.riskLevel}
                </span>
                <p class="mt-2 text-sm text-gray-600 capitalize">
                  ${item.symptoms.slice(0, 3).join(', ')}${item.symptoms.length > 3 ? ` +${item.symptoms.length - 3} more` : ''}
                </p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-800">${(item.riskScore * 100).toFixed(0)}%</p>
                <p class="text-xs text-gray-400">${new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </button>
        `).join('')}
      </div>
    `

    content.querySelectorAll('.history-item').forEach(btn => {
      btn.addEventListener('click', () => navigate(`/results/${btn.dataset.id}`))
    })

  } catch {
    document.getElementById('content').innerHTML = `
      <div class="text-center text-red-500 py-12">Failed to load history</div>
    `
  }
}