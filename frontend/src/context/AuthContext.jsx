import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api.js'
import { getToken, getUser, saveAuth, clearAuth } from '../components/auth.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(getUser)
  const [loading, setLoading] = useState(!!getToken())

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    authApi.me()
      .then(res => setUser(res.data.data))
      .catch(() => { clearAuth(); setUser(null) })
      .finally(() => setLoading(false))
  }, [])

  const login = (token, userData) => {
    saveAuth(token, userData)
    setUser(userData)
  }

  const logout = () => {
    clearAuth()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)