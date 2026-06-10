import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

function normalizeResponse(payload) {
  // apiClient helpers already return res.data, so this mainly guards against unexpected shapes.
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined) {
    return payload.data
  }
  return payload
}

export const noticeService = {
  async getAllAdminNotices() {
    const resData = await apiGet('/api/admin/notices')
    return normalizeResponse(resData)
  },

  async createNotice(payload) {
    const resData = await apiPost('/api/admin/notices', payload)
    return normalizeResponse(resData)
  },

  async updateNotice(id, payload) {
    const resData = await apiPut(`/api/admin/notices/${id}`, payload)
    return normalizeResponse(resData)
  },

  async deleteNotice(id) {
    await apiDelete(`/api/admin/notices/${id}`)
  },
}


