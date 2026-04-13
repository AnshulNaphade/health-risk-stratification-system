import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { authApi } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const BENEFITS = [
  'Track your health risk instantly',
  'Get personalized AI guidance',
  '100% secure & private',
]

export default function Login() {
  const { user, login }         = useAuth()
  const showToast               = useToast()
  const navigate                = useNavigate()
  const [form, setForm]         = useState({ email: '', password: '' })
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login(form)
      login(res.data.data.token, res.data.data.user)
      showToast('Welcome back! 👋', 'success')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div className="fade-in" style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Left panel — desktop only */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(145deg, #2D7DD2 0%, #1a5fa8 100%)',
        padding: 48, flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        display: 'var(--left-panel-display, none)',
      }}>
        <style>{`@media(min-width:768px){:root{--left-panel-display:flex}}`}</style>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <span style={{ fontSize: 32 }}>🛡️</span>
            <span style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>HealthRisk</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
            Your home<br />for health
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>
            AI-powered health risk awareness,<br />built for everyone.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {BENEFITS.map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#fff', fontSize: 13 }}>✓</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', top: -40, right: 40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', background: '#F7F8FC' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, justifyContent: 'center' }}>
            <span style={{ fontSize: 28 }}>🛡️</span>
            <span style={{ color: 'var(--primary)', fontSize: 22, fontWeight: 700 }}>HealthRisk</span>
          </div>

          <div className="card" style={{ padding: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Welcome back</h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>Sign in to continue to your dashboard</p>

            {error && (
              <div style={{ background: '#FDEDEC', border: '1px solid #E74C3C33', color: '#E74C3C', padding: '12px 14px', borderRadius: 10, fontSize: 14, marginBottom: 20 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email" required
                  className="input-field"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>
                  Password
                </label>
                <input
                  type="password" required
                  className="input-field"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 24 }}>
              New to HealthRisk?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                Create account
              </Link>
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 20, lineHeight: 1.6 }}>
            This tool is for awareness only — not a substitute for medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}