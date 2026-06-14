import { createContext, useContext, useMemo, useState } from 'react'
import { authService } from '../services/api/authService'
import { useAuth as useDecodedAuth } from '../hooks/useAuth'



const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const decoded = useDecodedAuth()
  const [loginLoading, setLoginLoading] = useState(false)

  const login = async (email, password) => {
    setLoginLoading(true)
    try {
      const res = await authService.login({ email, password })
      const token =
        res?.token ||
        res?.accessToken ||
        res?.data?.token ||
        res?.data?.accessToken ||
        res?.data?.data?.token ||
        res?.data?.data?.accessToken

      if (!token) throw new Error('Login failed: token missing')
      localStorage.setItem('erp_token', token)

      window.dispatchEvent(new Event('auth-token-changed'))
      return res
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed'
      throw new Error(msg)
    } finally {
      setLoginLoading(false)
    }
  }

  const logout = () => {
    decoded.logout()
    window.dispatchEvent(new Event('auth-token-changed'))
  }

  const value = useMemo(
    () => ({
      user: decoded.user,
      loading: decoded.loading || loginLoading,
      login,
      logout,
    }),
    [decoded.user, decoded.loading, loginLoading]
  )

  // Always render children so React Router can mount; Protected routes handle auth/redirect.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}

export const useAuth = () => useContext(AuthContext)



