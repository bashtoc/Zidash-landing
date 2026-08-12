import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { api, clearStoredSession, getStoredSession, sessionFromAuthResponse, storeSession } from './api'
import { AuthContext, useAuth } from './auth-context'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession())
  const [bootstrap, setBootstrap] = useState(null)
  const [loading, setLoading] = useState(Boolean(session?.accessToken))

  const refreshBootstrap = useCallback(async () => {
    if (!getStoredSession()?.accessToken) {
      setBootstrap(null)
      setLoading(false)
      return null
    }
    setLoading(true)
    try {
      const response = await api.bootstrap()
      setBootstrap(response.data)
      const stored = getStoredSession()
      if (stored) {
        const next = { ...stored, user: response.data?.user || stored.user }
        storeSession(next)
        setSession(next)
      }
      return response.data
    } catch {
      clearStoredSession()
      setSession(null)
      setBootstrap(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshBootstrap()
  }, [refreshBootstrap])

  useEffect(() => {
    const expire = () => {
      setSession(null)
      setBootstrap(null)
      setLoading(false)
    }
    window.addEventListener('zidash:session-expired', expire)
    return () => window.removeEventListener('zidash:session-expired', expire)
  }, [])

  const completeAuthentication = useCallback(async (response) => {
    const next = sessionFromAuthResponse(response)
    storeSession(next)
    setSession(next)
    setLoading(true)
    try {
      const bootstrapResponse = await api.bootstrap()
      setBootstrap(bootstrapResponse.data)
      const hydrated = {
        ...next,
        user: bootstrapResponse.data?.user || next.user,
      }
      storeSession(hydrated)
      setSession(hydrated)
      return bootstrapResponse.data
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    const stored = getStoredSession()
    try {
      if (stored?.refreshToken) await api.logout(stored.refreshToken)
    } catch {
      // Local logout still completes if the token has already expired.
    }
    clearStoredSession()
    setSession(null)
    setBootstrap(null)
  }, [])

  const value = useMemo(() => ({
    session,
    user: bootstrap?.user || session?.user || null,
    bootstrap,
    isAuthenticated: Boolean(session?.accessToken),
    loading,
    completeAuthentication,
    refreshBootstrap,
    logout,
  }), [session, bootstrap, loading, completeAuthentication, refreshBootstrap, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function RequireAuth({ children }) {
  const auth = useAuth()
  const location = useLocation()
  if (auth.loading) return <div className="app-page"><div className="page-loader" aria-label="Loading account" /></div>
  if (!auth.isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`
    return <Navigate to={`/auth?returnTo=${encodeURIComponent(returnTo)}`} replace />
  }
  return children
}
