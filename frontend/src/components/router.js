import { isAuthenticated } from './auth.js'
import { renderLogin }     from '../pages/login.js'
import { renderRegister }  from '../pages/register.js'
import { renderDashboard } from '../pages/dashboard.js'
import { renderResults }   from '../pages/results.js'
import { renderHistory }   from '../pages/history.js'

const PROTECTED = ['/dashboard', '/results', '/history']

export const navigate = (path) => {
  window.location.hash = `#${path}`
}

const getPath = () => {
  return window.location.hash.replace('#', '') || '/'
}

export const router = () => {
  const path = getPath()
  const app  = document.getElementById('app')

  if (path === '/') {
    return navigate(isAuthenticated() ? '/dashboard' : '/login')
  }

  const isProtected = PROTECTED.some(p => path.startsWith(p))
  if (isProtected && !isAuthenticated()) {
    return navigate('/login')
  }

  if ((path === '/login' || path === '/register') && isAuthenticated()) {
    return navigate('/dashboard')
  }

  if (path === '/login')           return renderLogin(app)
  if (path === '/register')        return renderRegister(app)
  if (path === '/dashboard')       return renderDashboard(app)
  if (path.startsWith('/results')) return renderResults(app, path.split('/')[2])
  if (path === '/history')         return renderHistory(app)
}