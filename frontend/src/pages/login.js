import { authApi } from '../services/api.js'
import { saveAuth } from '../components/auth.js'
import { navigate } from '../components/router.js'

export const renderLogin = (app) => {
  app.innerHTML = `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p class="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div id="error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"></div>

        <form id="login-form" class="space-y-4">
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
              placeholder="••••••••" />
          </div>
          <button type="submit" id="submit-btn"
            class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Sign in
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-500">
          No account?
          <a href="#/register" class="text-blue-600 hover:underline font-medium">Register</a>
        </p>
      </div>
    </div>
  `

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const btn   = document.getElementById('submit-btn')
    const error = document.getElementById('error')
    btn.textContent = 'Signing in...'
    btn.disabled    = true
    error.classList.add('hidden')

    try {
      const res = await authApi.login({
        email:    document.getElementById('email').value,
        password: document.getElementById('password').value,
      })
      saveAuth(res.data.data.token, res.data.data.user)
      navigate('/dashboard')
    } catch (err) {
      error.textContent = err.response?.data?.message || 'Login failed'
      error.classList.remove('hidden')
      btn.textContent = 'Sign in'
      btn.disabled    = false
    }
  })
}