import { apiGet } from './apiClient'

function normalize(payload) {
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined) {
    return payload.data
  }
  return payload
}

export const statsService = {
  async getAdminStats() {
    const resData = await apiGet('/api/admin/stats')
    return normalize(resData)
  },
}

