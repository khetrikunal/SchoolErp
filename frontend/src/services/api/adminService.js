import { apiGet, apiPost } from './apiClient'

function normalize(payload) {
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined) {
    return payload.data
  }
  return payload
}

export const adminService = {
  async createAdmin(payload) {
    const resData = await apiPost('/api/admin/admins', payload)
    return normalize(resData)
  },

  async getAdmins() {
    const resData = await apiGet('/api/admin/admins')
    return normalize(resData)
  },
}

