import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

const COLORS = {
  success: '#27AE60',
  error:   '#E74C3C',
  info:    '#2D7DD2',
}

export const ToastProvider = ({ children }) => {
  const [toast, setToast]   = useState(null)
  const [visible, setVisible] = useState(false)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setVisible(true)
    setTimeout(() => setVisible(false), 3000)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: COLORS[toast.type] || COLORS.info,
          color: '#fff', padding: '14px 20px',
          borderRadius: 12, fontSize: 14, fontWeight: 500,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          transition: 'opacity 300ms ease, transform 300ms ease',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          pointerEvents: 'none', maxWidth: 320,
        }}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)