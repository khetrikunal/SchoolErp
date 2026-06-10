import { createContext, useContext, useMemo, useState } from 'react'
import { authService } from '../services/api/authService'
import { useAuth as useDecodedAuth } from '../hooks/useAuth'



const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const decoded = useDecodedAuth()
  const [loginLoading, setLoginLoading] = useState(false)

  const login = async (email, password) => {
    setLoginLoading(true)
    console.groupCollapsed('[AuthContext] login')
    console.log('[AuthContext] login called')
    console.log('[AuthContext] credentials email:', email)

    try {
      console.log('[AuthContext] calling authService.login')
      const res = await authService.login({ email, password })
      console.log('[AuthContext] authService.login response:', res)


      // Handle multiple possible response shapes
      // Supported:
      //  - { token: "..." }
      //  - { accessToken: "..." }
      //  - { data: { token: "..." } }
      //  - nested: res.data.data.token, etc.
      const token =
        res?.token ||
        res?.accessToken ||
        res?.data?.token ||
        res?.data?.accessToken ||
        res?.data?.data?.token ||
        res?.data?.data?.accessToken

      console.log('[AuthContext] extracted token:', token ? '[present]' : '[missing]')
      if (!token) throw new Error('Login failed: token missing')

      console.log('[AuthContext] writing localStorage.erp_token')
      localStorage.setItem('erp_token', token)
      console.log('localStorage.erp_token exists after set:', Boolean(localStorage.getItem('erp_token')))

      // Notify listeners in the same tab that token is now available.
      window.dispatchEvent(new Event('auth-token-changed'))

      return res
    } catch (err) {
      console.error('[AuthContext] login failed:', err)
      const msg = err?.response?.data?.message || err?.message || 'Login failed'
      throw new Error(msg)
    } finally {
      setLoginLoading(false)
      console.groupEnd()
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



