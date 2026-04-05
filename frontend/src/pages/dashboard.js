import { assessmentApi } from '../services/api.js'
import { clearAuth, getUser } from '../components/auth.js'
import { navigate } from '../components/router.js'

export const renderDashboard = async (app) => {
  const user = getUser()

  app.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-lg font-semibold text-gray-900">Health Risk System</h1>
          <p class="text-xs text-gray-500">Awareness tool only — not medical advice</p>
        </div>
        <div class="flex items-center gap-4">
          <button id="history-btn" class="text-sm text-gray-600 hover:text-gray-900">History</button>
          <span class="text-sm text-gray-500">${user?.name || user?.email || ''}</span>
          <button id="logout-btn" class="text-sm text-red-600 hover:text-red-700">Logout</button>
        </div>
      </nav>

      <div class="max-w-3xl mx-auto px-4 py-8">
        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm">
          <strong>Important:</strong> This tool provides health awareness information only.
          It does not diagnose conditions or replace professional medical advice.
          Always consult a qualified healthcare professional.
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-1">Select your symptoms</h2>
          <p class="text-gray-500 text-sm mb-6">Choose all symptoms you are currently experiencing</p>

          <div id="error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"></div>

          <div id="symptoms-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            <div class="text-gray-400 text-sm col-span-3">Loading symptoms...</div>
          </div>

          <div id="selected-preview" class="hidden mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-xs text-gray-500 mb-1">Selected (<span id="selected-count">0</span>)</p>
            <p id="selected-list" class="text-sm text-gray-700 capitalize"></p>
          </div>

          <button id="analyse-btn" disabled
            class="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Select symptoms to analyse
          </button>
        </div>
      </div>
    </div>
  `

  document.getElementById('logout-btn').addEventListener('click', () => {
    clearAuth()
    navigate('/login')
  })

  document.getElementById('history-btn').addEventListener('click', () => {
    navigate('/history')
  })

  let selected = []

  try {
    const res      = await assessmentApi.getSymptoms()
    const symptoms = res.data.data
    const grid     = document.getElementById('symptoms-grid')

    grid.innerHTML = symptoms.map(s => `
      <button data-symptom="${s}"
        class="symptom-btn px-3 py-2 rounded-lg text-sm border text-left transition-all capitalize
               bg-white text-gray-700 border-gray-200 hover:border-blue-300">
        ${s}
      </button>
    `).join('')

    grid.querySelectorAll('.symptom-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const symptom = btn.dataset.symptom
        if (selected.includes(symptom)) {
          selected = selected.filter(s => s !== symptom)
          btn.className = 'symptom-btn px-3 py-2 rounded-lg text-sm border text-left transition-all capitalize bg-white text-gray-700 border-gray-200 hover:border-blue-300'
        } else {
          selected.push(symptom)
          btn.className = 'symptom-btn px-3 py-2 rounded-lg text-sm border text-left transition-all capitalize bg-blue-600 text-white border-blue-600'
        }
        updatePreview()
      })
    })
  } catch {
    document.getElementById('error').textContent = 'Failed to load symptoms'
    document.getElementById('error').classList.remove('hidden')
  }

  const updatePreview = () => {
    const preview = document.getElementById('selected-preview')
    const count   = document.getElementById('selected-count')
    const list    = document.getElementById('selected-list')
    const btn     = document.getElementById('analyse-btn')

    if (selected.length) {
      preview.classList.remove('hidden')
      count.textContent = selected.length
      list.textContent  = selected.join(', ')
      btn.disabled      = false
      btn.textContent   = `Analyse ${selected.length} symptom${selected.length !== 1 ? 's' : ''}`
    } else {
      preview.classList.add('hidden')
      btn.disabled    = true
      btn.textContent = 'Select symptoms to analyse'
    }
  }

  document.getElementById('analyse-btn').addEventListener('click', async () => {
    const btn   = document.getElementById('analyse-btn')
    const error = document.getElementById('error')
    btn.textContent = 'Analysing...'
    btn.disabled    = true
    error.classList.add('hidden')

    try {
      const res = await assessmentApi.submit({ symptoms: selected })
      const id  = res.data.data.id
      sessionStorage.setItem(`assessment_${id}`, JSON.stringify(res.data.data))
      navigate(`/results/${id}`)
    } catch (err) {
      error.textContent = err.response?.data?.message || 'Assessment failed'
      error.classList.remove('hidden')
      btn.disabled    = false
      btn.textContent = `Analyse ${selected.length} symptom${selected.length !== 1 ? 's' : ''}`
    }
  })
}