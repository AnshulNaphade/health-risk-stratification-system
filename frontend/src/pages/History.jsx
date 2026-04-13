import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { historyApi } from '../services/api.js'
import { SkeletonGrid } from '../components/ui/Skeleton.jsx'

const RISK_CONFIG = {
  LOW:      { dot: '#27AE60', bg: '#E8F8F0', color: '#27AE60' },
  MODERATE: { dot: '#F39C12', bg: '#FEF9E7', color: '#F39C12' },
  HIGH:     { dot: '#E67E22', bg: '#FEF5E7', color: '#E67E22' },
  CRITICAL: { dot: '#E74C3C', bg: '#FDEDEC', color: '#E74C3C' },
}

const FILTERS = ['All', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL']

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('All')
  const navigate              = useNavigate()

  useEffect(() => {
    historyApi.getAll()
      .then(res => setHistory(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All'
    ? history
    : history.filter(i => i.riskLevel === filter)

  return (
    <div className="fade-in" style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate('/dashboard')}>
          <span>🛡️</span>HealthRisk
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ padding: '10px 20px', background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + New Assessment
        </button>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Assessment History</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>Track your health risk over time</p>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 18px', borderRadius: 'var(--radius-pill)', fontSize: 13, fontWeight: 500,
                border: `1.5px solid ${filter === f ? 'var(--primary)' : 'var(--border)'}`,
                background: filter === f ? 'var(--primary)' : '#fff',
                color: filter === f ? '#fff' : 'var(--muted)',
                cursor: 'pointer', transition: 'all 200ms',
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? <SkeletonGrid count={4} /> : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🏥</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              {history.length === 0 ? 'No assessments yet' : `No ${filter} risk assessments`}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
              {history.length === 0 ? 'Complete your first health risk assessment.' : 'Try a different filter.'}
            </p>
            {history.length === 0 && (
              <button onClick={() => navigate('/dashboard')}
                style={{ padding: '12px 28px', background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Start Assessment
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(item => {
              const cfg     = RISK_CONFIG[item.riskLevel] || RISK_CONFIG.LOW
              const date    = new Date(item.createdAt)
              const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
              const shown   = item.symptoms.slice(0, 3)
              const extra   = item.symptoms.length - 3

              return (
                <div
                  key={item.id}
                  className="hover-card"
                  onClick={() => navigate(`/results/${item.id}`)}
                  style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border)', padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
                >
                  {/* Left */}
                  <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 64 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: cfg.dot + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', background: cfg.dot }} />
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.3 }}>{dateStr}</p>
                    <p style={{ fontSize: 10, color: 'var(--muted)' }}>{timeStr}</p>
                  </div>

                  {/* Middle */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'inline-block', background: cfg.bg, color: cfg.color, padding: '3px 10px', borderRadius: 'var(--radius-pill)', fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
                      {item.riskLevel}
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {shown.map(s => (
                        <span key={s} style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 'var(--radius-pill)', fontSize: 12, textTransform: 'capitalize' }}>
                          {s}
                        </span>
                      ))}
                      {extra > 0 && (
                        <span style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 'var(--radius-pill)', fontSize: 12 }}>
                          +{extra} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <p style={{ fontSize: 26, fontWeight: 700, color: cfg.dot, lineHeight: 1 }}>
                      {(item.riskScore * 100).toFixed(0)}%
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>risk score</p>
                    <p style={{ fontSize: 18, color: 'var(--border)', marginTop: 4 }}>›</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}