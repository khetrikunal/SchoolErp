import { useCallback, useEffect, useMemo, useState } from 'react'

function safeJsonParse(s) {

  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}

function base64UrlDecode(str) {
  const s = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = s.length % 4 ? '='.repeat(4 - (s.length % 4)) : ''
  const decoded = atob(s + pad)
  return decoded
}

function decodeJwt(token) {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = base64UrlDecode(parts[1])
    return safeJsonParse(payload)
  } catch {
    return null
  }
}

function inferUserFromJwt(payload) {
  if (!payload || typeof payload !== 'object') return null

  // Common claim names we might encounter from backend.
  const role = payload.role || payload.roles || payload.authorities?.[0]
  let normalizedRole = null

  // If authorities/roles array exists
  if (Array.isArray(role)) {
    const r0 = role[0]
    normalizedRole = typeof r0 === 'string' ? r0.replace(/^ROLE_/, '') : null
  } else if (typeof role === 'string') {
    normalizedRole = role.replace(/^ROLE_/, '')
  }

  // Some implementations store role under `sub` or similar.
  if (!normalizedRole && payload.sub && typeof payload.sub === 'string') {
    normalizedRole = payload.sub.replace(/^ROLE_/, '')
  }

  const name = payload.name || payload.fullName || payload.given_name || payload.unique_name
  const email = payload.email || payload.username
  const designation = payload.designation

  if (!normalizedRole) return null

  return {
    name: name || 'User',
    email: email || '',
    role: normalizedRole,
    designation,
    id: payload.id || payload.userId,
    classes: payload.classes || [],
    class: payload.class || '',
    section: payload.section || '',
    rollNo: payload.rollNo || '',
    phone: payload.phone || '',
    admissionYear: payload.admissionYear || '',
    parentName: payload.parentName || '',
    studentId: payload.studentId || '',
    teacherId: payload.teacherId || '',
  }
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const syncFromToken = useCallback(() => {
    const token = localStorage.getItem('erp_token')

    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    const payload = decodeJwt(token)
    if (!payload) {
      localStorage.removeItem('erp_token')
      setUser(null)
      setLoading(false)
      return
    }

    // Check JWT expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('erp_token')
      setUser(null)
      setLoading(false)
      return
    }

    const decodedUser = inferUserFromJwt(payload)

    if (!decodedUser) {
      localStorage.removeItem('erp_token')
      setUser(null)
      setLoading(false)
      return
    }

    setUser(decodedUser)
    setLoading(false)
  }, [])

  useEffect(() => {
    // First sync on mount
    setLoading(true)
    syncFromToken()

    const handler = () => {
      setLoading(true)
      syncFromToken()
    }

    window.addEventListener('auth-token-changed', handler)
    return () => window.removeEventListener('auth-token-changed', handler)
  }, [syncFromToken])

  const logout = useCallback(() => {
    localStorage.removeItem('erp_token')
    setUser(null)
    setLoading(false)
  }, [])

  return useMemo(() => ({ user, loading, logout, setUser }), [user, loading, logout])
}







