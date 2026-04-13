import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { assessmentApi } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { SkeletonGrid } from '../components/ui/Skeleton.jsx'

const CATEGORIES = {
  '🫀 Cardiovascular':   ['chest pain', 'shortness of breath', 'dizziness'],
  '🤒 Infection':        ['high fever', 'sore throat', 'runny nose', 'persistent cough'],
  '🧠 Neurological':     ['severe headache', 'mild headache'],
  '😴 General':          ['fatigue', 'body ache', 'loss of appetite'],
  '🤢 Gastrointestinal': ['nausea', 'vomiting', 'abdominal pain'],
}

const SYMPTOM_INFO = {
  'chest pain':          'Discomfort or pressure in the chest area',
  'shortness of breath': 'Difficulty breathing or feeling breathless',
  'high fever':          'Body temperature above 38.5°C',
  'dizziness':           'Feeling lightheaded or unsteady',
  'fatigue':             'Persistent tiredness not relieved by rest',
  'nausea':              'Feeling of sickness or urge to vomit',
  'vomiting':            'Forceful expulsion of stomach contents',
  'abdominal pain':      'Pain or discomfort in the stomach area',
  'severe headache':     'Intense head pain, possibly throbbing',
  'mild headache':       'Mild pain or pressure in the head',
  'sore throat':         'Pain or irritation in the throat',
  'runny nose':          'Excess mucus discharge from the nose',
  'persistent cough':    'Cough lasting more than a few days',
  'body ache':           'General muscle pain or soreness',
  'loss of appetite':    'Reduced desire to eat',
}

const getGreeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

export default function Dashboard() {
  const { user, logout }            = useAuth()
  const showToast                   = useToast()
  const navigate                    = useNavigate()
  const [symptoms, setSymptoms]     = useState(null)
  const [selected, setSelected]     = useState([])
  const [loadError, setLoadError]   = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [analysing, setAnalysing]   = useState(false)
  const initial = (user?.name || user?.email || '?')[0].toUpperCase()

  useEffect(() => {
    let cancelled = false
    assessmentApi.getSymptoms()
      .then(res => { if (!cancelled) setSymptoms(res.data.data) })
      .catch(() => { if (!cancelled) { setLoadError(true); setSymptoms([]) } })
    return () => { cancelled = true }
  }, [])

  const toggleSymptom = useCallback((s) => {
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }, [])

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully', 'info')
    navigate('/login')
  }

  const handleAnalyse = async () => {
    setAnalysing(true)
    setSubmitError('')
    try {
      const res = await assessmentApi.submit({ symptoms: selected })
      const id  = res.data.data.id
      sessionStorage.setItem(`assessment_${id}`, JSON.stringify(res.data.data))
      showToast('Assessment complete! ✓', 'success')
      navigate(`/results/${id}`)
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Assessment failed. Please try again.')
      showToast('Assessment failed', 'error')
      setAnalysing(false)
    }
  }

  return (
    <div className="fade-in" style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 100 }}>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span>🛡️</span>HealthRisk
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => navigate('/history')}
            style={{ padding: '8px 16px', background: 'transparent', color: 'var(--primary)', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500 }}>
            History
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--primary-light)', borderRadius: 'var(--radius-pill)' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>
              {initial}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--primary)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || user?.email || ''}
            </span>
          </div>
          <button onClick={handleLogout}
            style={{ padding: '8px 16px', background: 'transparent', color: '#E74C3C', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500 }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>

        {/* Disclaimer */}
        <div style={{ background: '#EBF4FF', border: '1.5px solid rgba(45,125,210,0.2)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
          <p style={{ fontSize: 13, color: '#1a5fa8', lineHeight: 1.5 }}>
            This tool provides <strong>health awareness only</strong> — not a medical diagnosis. Always consult a qualified doctor.
          </p>
        </div>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #2D7DD2 0%, #1a5fa8 100%)',
          borderRadius: 'var(--radius-lg)', padding: 32, marginBottom: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 }}>{getGreeting()},</p>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 700, marginBottom: 8 }}>{user?.name || 'there'} 👋</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.5 }}>
              How are you feeling today?<br />Select your symptoms for an instant risk analysis.
            </p>
            <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['⚡ Instant analysis', '🤖 ML-powered', '🔒 Private'].map(tag => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '6px 14px', borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Symptom card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Select your symptoms</h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Tap all symptoms you are currently experiencing</p>
            </div>
            {selected.length > 0 && (
              <button onClick={() => setSelected([])}
                style={{ background: '#FDEDEC', color: '#E74C3C', border: 'none', padding: '6px 14px', borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 500, flexShrink: 0 }}>
                Clear all
              </button>
            )}
          </div>

          {submitError && (
            <div style={{ background: '#FDEDEC', border: '1px solid #E74C3C33', color: '#E74C3C', padding: '12px 14px', borderRadius: 10, fontSize: 14, marginBottom: 16 }}>
              {submitError}
            </div>
          )}

          {loadError && (
            <div style={{ background: '#FDEDEC', color: '#E74C3C', padding: '12px 14px', borderRadius: 10, fontSize: 14, marginBottom: 16 }}>
              Failed to load symptoms. Please refresh.
            </div>
          )}

          {symptoms === null ? (
            <SkeletonGrid count={3} />
          ) : (
            Object.entries(CATEGORIES).map(([category, catSymptoms]) => {
              const available = catSymptoms.filter(s => symptoms.includes(s))
              if (!available.length) return null
              return (
                <div key={category} style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                    {category}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {available.map(symptom => {
                      const on = selected.includes(symptom)
                      return (
                        <button
                          key={symptom}
                          title={SYMPTOM_INFO[symptom] || ''}
                          onClick={() => toggleSymptom(symptom)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-pill)',
                            border: `1.5px solid ${on ? 'var(--primary)' : 'var(--border)'}`,
                            background: on ? 'var(--primary)' : '#fff',
                            color: on ? '#fff' : 'var(--text)',
                            fontSize: 13, fontWeight: 500,
                            transition: 'all 200ms',
                            textTransform: 'capitalize',
                            cursor: 'pointer',
                          }}
                        >
                          {symptom}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}

          {/* Selected preview */}
          {selected.length > 0 && (
            <div style={{ marginTop: 20, background: 'var(--primary-light)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Selected ({selected.length})
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selected.map(s => (
                  <span key={s} style={{ background: '#fff', color: 'var(--primary)', border: '1px solid rgba(45,125,210,0.3)', padding: '4px 12px', borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 500, textTransform: 'capitalize' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1.5px solid var(--border)', padding: '16px 24px', zIndex: 50 }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <button
            onClick={handleAnalyse}
            disabled={!selected.length || analysing}
            style={{
              width: '100%', maxWidth: 400, display: 'block', margin: '0 auto',
              padding: 14,
              background: selected.length && !analysing ? 'var(--orange)' : '#ccc',
              color: '#fff', border: 'none', borderRadius: 'var(--radius)',
              fontSize: 15, fontWeight: 600,
              cursor: selected.length && !analysing ? 'pointer' : 'not-allowed',
              transition: 'background 200ms',
            }}
          >
            {analysing
              ? 'Analysing...'
              : selected.length
                ? `Analyse ${selected.length} symptom${selected.length !== 1 ? 's' : ''}`
                : 'Select symptoms to analyse'}
          </button>
        </div>
      </div>
    </div>
  )
}