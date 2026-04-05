import { authApi } from '../services/api.js'
import { saveAuth } from '../components/auth.js'
import { navigate } from '../components/router.js'

export const renderRegister = (app) => {
  app.innerHTML = `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-gray-900">Create account</h1>
          <p class="text-gray-500 mt-1">Start tracking your health awareness</p>
        </div>

        <div id="error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"></div>

        <form id="register-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input id="name" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Anshul" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="email" type="email" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="password" type="password" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Min 8 characters" />
          </div>
          <button type="submit" id="submit-btn"
            class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Create account
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-500">
          Already have an account?
          <a href="#/login" class="text-blue-600 hover:underline font-medium">Sign in</a>
        </p>
      </div>
    </div>
  `

  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const btn   = document.getElementById('submit-btn')
    const error = document.getElementById('error')
    btn.textContent = 'Creating account...'
    btn.disabled    = true
    error.classList.add('hidden')

    try {
      const res = await authApi.register({
        name:     document.getElementById('name').value,
        email:    document.getElementById('email').value,
        password: document.getElementById('password').value,
      })
      saveAuth(res.data.data.token, res.data.data.user)
      navigate('/dashboard')
    } catch (err) {
      error.textContent = err.response?.data?.message || 'Registration failed'
      error.classList.remove('hidden')
      btn.textContent = 'Create account'
      btn.disabled    = false
    }
  })
}