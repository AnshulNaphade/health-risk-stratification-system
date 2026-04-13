import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { authApi } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const getStrength = (val) => {
  if (!val)        return { width: '0%',   color: '',        label: '' }
  if (val.length < 6)  return { width: '33%',  color: '#E74C3C', label: 'Weak' }
  if (val.length < 10) return { width: '66%',  color: '#F39C12', label: 'Medium' }
  return                      { width: '100%', color: '#27AE60', label: 'Strong' }
}

export default function Register() {
  const { user, login }       = useAuth()
  const showToast             = useToast()
  const navigate              = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const strength              = getStrength(form.password)

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.register(form)
      login(res.data.data.token, res.data.data.user)
      showToast('Account created! Welcome 🎉', 'success')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <div className="fade-in" style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Left panel */}
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
            Start your<br />health journey
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>
            Join thousands tracking their<br />health risk with AI.
          </p>
          {['Symptom-based risk analysis', 'ML-powered confidence scoring', 'Full assessment history'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: 13 }}>✓</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15 }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', background: '#F7F8FC' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, justifyContent: 'center' }}>
            <span style={{ fontSize: 28 }}>🛡️</span>
            <span style={{ color: 'var(--primary)', fontSize: 22, fontWeight: 700 }}>HealthRisk</span>
          </div>

          <div className="card" style={{ padding: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Create account</h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>Start tracking your health risk today</p>

            {error && (
              <div style={{ background: '#FDEDEC', border: '1px solid #E74C3C33', color: '#E74C3C', padding: '12px 14px', borderRadius: 10, fontSize: 14, marginBottom: 20 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Full name</label>
                <input type="text" className="input-field" placeholder="Anshul Naphade"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email address</label>
                <input type="email" required className="input-field" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Password</label>
                <input type="password" required className="input-field" placeholder="Min 8 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>

              {/* Password strength bar */}
              <div style={{ height: 4, background: '#E8ECF0', borderRadius: 4, marginBottom: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: 4, transition: 'width 300ms ease, background 300ms ease' }} />
              </div>
              <p style={{ fontSize: 12, fontWeight: 500, color: strength.color, minHeight: 16, marginBottom: 20 }}>
                {strength.label}
              </p>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 24 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}