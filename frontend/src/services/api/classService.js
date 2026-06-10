import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

function normalize(payload) {
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined) {
    return payload.data
  }
  return payload
}

export const classService = {
  async getAllAdminClasses() {
    const resData = await apiGet('/api/admin/classes')
    return normalize(resData)
  },

  async getClassById(id) {
    const resData = await apiGet(`/api/admin/classes/${id}`)
    return normalize(resData)
  },

  async createClass(payload) {
    const resData = await apiPost('/api/admin/classes', payload)
    return normalize(resData)
  },

  async updateClass(id, payload) {
    const resData = await apiPut(`/api/admin/classes/${id}`, payload)
    return normalize(resData)
  },

  async deleteClass(id) {
    await apiDelete(`/api/admin/classes/${id}`)
  },
}

