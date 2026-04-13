import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { historyApi } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import { SkeletonGrid } from '../components/ui/Skeleton.jsx'

const RISK_CONFIG = {
  LOW:      { label: 'Low Risk',      grad: 'linear-gradient(135deg,#27AE60,#2ECC71)', icon: '✅', dot: '#27AE60' },
  MODERATE: { label: 'Moderate Risk', grad: 'linear-gradient(135deg,#F39C12,#F1C40F)', icon: '🟡', dot: '#F39C12' },
  HIGH:     { label: 'High Risk',     grad: 'linear-gradient(135deg,#E67E22,#F39C12)', icon: '⚠️', dot: '#E67E22' },
  CRITICAL: { label: 'Critical Risk', grad: 'linear-gradient(135deg,#E74C3C,#C0392B)', icon: '🚨', dot: '#E74C3C' },
}

export default function Results() {
  const { id }                      = useParams()
  const navigate                    = useNavigate()
  const showToast                   = useToast()
  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading]       = useState(true)
  const [barWidths, setBarWidths]   = useState({ risk: 0, conf: 0 })

  useEffect(() => {
    setLoading(true)
    setAssessment(null)
    setBarWidths({ risk: 0, conf: 0 })

    let cancelled = false
    const cached = sessionStorage.getItem(`assessment_${id}`)

    if (cached) {
      if (!cancelled) { setAssessment(JSON.parse(cached)); setLoading(false) }
    } else {
      historyApi.getById(id)
        .then(res => { if (!cancelled) { setAssessment(res.data.data); setLoading(false) } })
        .catch(() => { if (!cancelled) { showToast('Assessment not found', 'error'); navigate('/history') } })
    }

    return () => { cancelled = true }
  }, [id])

  // Animate bars after assessment loads
  useEffect(() => {
    if (!assessment) return
    const t = setTimeout(() => {
      setBarWidths({
        risk: assessment.riskScore * 100,
        conf: assessment.confidenceScore * 100,
      })
    }, 100)
    return () => clearTimeout(t)
  }, [assessment])

  const handleShare = async (cfg, riskPct) => {
    const text = `HealthRisk: ${cfg.label} — ${riskPct}% risk score`
    const url  = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: 'HealthRisk', text, url })
        showToast('Shared successfully ✓', 'success')
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        showToast('Link copied to clipboard ✓', 'success')
      }
    } catch (e) {
      if (e?.name !== 'AbortError') showToast('Could not share', 'error')
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="navbar">
        <span style={{ fontSize: 15, fontWeight: 600 }}>← Assessment Result</span>
      </nav>
      <div style={{ maxWidth: 680, margin: '24px auto', padding: '0 16px' }}>
        <SkeletonGrid count={4} />
      </div>
    </div>
  )

  if (!assessment) return null

  const cfg     = RISK_CONFIG[assessment.riskLevel] || RISK_CONFIG.LOW
  const bd      = assessment.breakdown
  const riskPct = (assessment.riskScore * 100).toFixed(1)
  const confPct = (assessment.confidenceScore * 100).toFixed(1)

  return (
    <div className="fade-in" style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Navbar */}
      <nav className="navbar">
        <button onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text)', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          ← Assessment Result
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/dashboard')}
            style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            + New
          </button>
          <button onClick={() => navigate('/history')}
            style={{ padding: '8px 16px', background: 'transparent', color: 'var(--primary)', border: 'none', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            History
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Risk hero */}
        <div style={{ background: cfg.grad, borderRadius: 'var(--radius-lg)', padding: 32, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ fontSize: 52, marginBottom: 12 }}>{cfg.icon}</div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Risk Assessment Result</p>
          <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 700, marginBottom: 24 }}>{cfg.label}</h2>

          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius)', padding: 20, textAlign: 'left' }}>
            {[
              { label: 'Risk Score',  pct: riskPct, width: barWidths.risk, opacity: 1   },
              { label: 'Confidence',  pct: confPct, width: barWidths.conf, opacity: 0.8 },
            ].map(({ label, pct, width, opacity }) => (
              <div key={label} style={{ marginBottom: label === 'Risk Score' ? 16 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500 }}>{label}</span>
                  <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${width}%`,
                    background: `rgba(255,255,255,${opacity})`,
                    borderRadius: 4,
                    transition: 'width 700ms ease-out',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score breakdown */}
        {bd && (
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📊 Score Breakdown</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { label: 'Rule-based', value: bd.ruleBasedScore !== 'unavailable' ? `${(bd.ruleBasedScore * 100).toFixed(1)}%` : '—', bg: 'var(--bg)',          color: 'var(--text)'    },
                { label: 'ML Model',   value: bd.mlScore !== 'unavailable'        ? `${(bd.mlScore * 100).toFixed(1)}%`        : '—', bg: 'var(--bg)',          color: 'var(--text)'    },
                { label: 'Blended',    value: `${(bd.blendedScore * 100).toFixed(1)}%`,                                               bg: 'var(--primary-light)', color: 'var(--primary)' },
              ].map(({ label, value, bg, color }) => (
                <div key={label} style={{ background: bg, borderRadius: 'var(--radius)', padding: 14, textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>{label}</p>
                  <p style={{ fontSize: 22, fontWeight: 700, color }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Symptoms */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🩺 Reported Symptoms</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {assessment.symptoms.map(s => (
              <span key={s} style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(45,125,210,0.2)', padding: '6px 14px', borderRadius: 'var(--radius-pill)', fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Analysis */}
        <div className="card" style={{ borderLeft: '4px solid var(--primary)', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>🔍 Analysis</h3>
          <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.7 }}>{assessment.explanation}</p>
        </div>

        {/* Guidance */}
        <div className="card" style={{ borderLeft: '4px solid var(--orange)', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>💡 Guidance</h3>
          <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.7 }}>{assessment.guidance}</p>
        </div>

        {/* CTAs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button
            onClick={() => showToast('🚀 Doctor booking coming soon!', 'info')}
            style={{ background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            🏥 Book a Doctor
          </button>
          <button
            onClick={() => handleShare(cfg, riskPct)}
            style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1.5px solid rgba(45,125,210,0.2)', borderRadius: 'var(--radius)', padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Share Result
          </button>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'transparent', color: 'var(--primary)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
          ← Back to Dashboard
        </button>

        {/* Disclaimer */}
        <div style={{ background: '#F7F8FC', borderRadius: 'var(--radius)', padding: '14px 16px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
            This result is for <strong>awareness purposes only</strong> and does not constitute medical advice.
            Please consult a qualified healthcare professional for any health concerns.
          </p>
        </div>

      </div>
    </div>
  )
}