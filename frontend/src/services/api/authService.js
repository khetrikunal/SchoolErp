import { apiPost } from './apiClient'

function unwrapApiResponse(res) {
  // backend returns ApiResponse.ok(message, data)
  // apiPost wrapper already returns r.data, so try to unwrap safely.
  if (res && typeof res === 'object') {
    if ('data' in res && res.data && typeof res.data === 'object') return res.data
    if ('data' in res) return res.data
  }
  return res
}

export const authService = {
  async login({ email, password }) {
    const loginInput = (email ?? '').toString().trim()

    const body = loginInput.includes('@')
      ? { email: loginInput, password }
      : { identifier: loginInput, password }

    // Backend endpoint is /api/auth/login
    const res = await apiPost('/api/auth/login', body)


    // Expected by AuthContext: token or token nested inside
    return unwrapApiResponse(res)
  },
}



