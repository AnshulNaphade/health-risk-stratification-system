import { historyApi } from '../services/api.js'
import { navigate } from '../components/router.js'

const RISK_CONFIG = {
  LOW:      { label: 'Low Risk',      bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800',  bar: 'bg-green-500'  },
  MODERATE: { label: 'Moderate Risk', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', bar: 'bg-yellow-500' },
  HIGH:     { label: 'High Risk',     bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', bar: 'bg-orange-500' },
  CRITICAL: { label: 'Critical Risk', bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800',    bar: 'bg-red-500'    },
}

export const renderResults = async (app, id) => {
  app.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 class="text-lg font-semibold text-gray-900">Assessment Result</h1>
        <div class="flex gap-3">
          <button id="new-btn" class="text-sm text-blue-600 hover:underline">New assessment</button>
          <button id="history-btn" class="text-sm text-gray-600 hover:underline">History</button>
        </div>
      </nav>
      <div id="content" class="max-w-2xl mx-auto px-4 py-8">
        <div class="text-center text-gray-400 py-12">Loading result...</div>
      </div>
    </div>
  `

  document.getElementById('new-btn').addEventListener('click',     () => navigate('/dashboard'))
  document.getElementById('history-btn').addEventListener('click', () => navigate('/history'))

  let assessment = JSON.parse(sessionStorage.getItem(`assessment_${id}`) || 'null')

  if (!assessment) {
    try {
      const res  = await historyApi.getById(id)
      assessment = res.data.data
    } catch {
      return navigate('/history')
    }
  }

  const cfg = RISK_CONFIG[assessment.riskLevel] || RISK_CONFIG.LOW
  const bd  = assessment.breakdown

  document.getElementById('content').innerHTML = `
    <div class="space-y-4">
      <div class="rounded-2xl border p-6 ${cfg.bg} ${cfg.border}">
        <p class="text-sm font-medium text-gray-500 mb-1">Risk level</p>
        <h2 class="text-3xl font-bold ${cfg.text}">${cfg.label}</h2>
        <div class="mt-4 space-y-2">
          <div>
            <div class="flex justify-between text-xs text-gray-500 mb-1">
              <span>Risk score</span><span>${(assessment.riskScore * 100).toFixed(1)}%</span>
            </div>
            <div class="h-2 bg-white rounded-full overflow-hidden">
              <div class="h-full rounded-full ${cfg.bar}" style="width:${assessment.riskScore * 100}%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-xs text-gray-500 mb-1">
              <span>Confidence</span><span>${(assessment.confidenceScore * 100).toFixed(1)}%</span>
            </div>
            <div class="h-2 bg-white rounded-full overflow-hidden">
              <div class="h-full rounded-full bg-blue-500" style="width:${assessment.confidenceScore * 100}%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-3">Reported symptoms</h3>
        <div class="flex flex-wrap gap-2">
          ${assessment.symptoms.map(s => `
            <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">${s}</span>
          `).join('')}
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-2">Analysis</h3>
        <p class="text-gray-600 text-sm leading-relaxed">${assessment.explanation}</p>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-2">Guidance</h3>
        <p class="text-gray-600 text-sm leading-relaxed">${assessment.guidance}</p>
      </div>

      ${bd ? `
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-3">Score breakdown</h3>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div class="p-3 bg-gray-50 rounded-xl">
            <p class="text-xs text-gray-500 mb-1">Rule-based</p>
            <p class="text-lg font-semibold text-gray-800">${(bd.ruleBasedScore * 100).toFixed(1)}%</p>
          </div>
          <div class="p-3 bg-gray-50 rounded-xl">
            <p class="text-xs text-gray-500 mb-1">ML model</p>
            <p class="text-lg font-semibold text-gray-800">
              ${bd.mlScore !== 'unavailable' ? `${(bd.mlScore * 100).toFixed(1)}%` : '—'}
            </p>
          </div>
          <div class="p-3 bg-blue-50 rounded-xl">
            <p class="text-xs text-blue-600 mb-1">Blended</p>
            <p class="text-lg font-semibold text-blue-800">${(bd.blendedScore * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>` : ''}

      <div class="p-4 bg-gray-100 rounded-xl text-xs text-gray-500 text-center">
        This result is for awareness purposes only and does not constitute medical advice.
        Please consult a qualified healthcare professional for any health concerns.
      </div>
    </div>
  `
}