import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

function normalize(payload) {
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined) {
    return payload.data
  }
  return payload
}

export const studentService = {
  async getAllAdminStudents() {
    const resData = await apiGet('/api/admin/students')
    return normalize(resData)
  },

  async createStudent(payload) {
    const resData = await apiPost('/api/admin/students', payload)
    return normalize(resData)
  },

  async updateStudent(id, payload) {
    const resData = await apiPut(`/api/admin/students/${id}`, payload)
    return normalize(resData)
  },

  async deleteStudent(id) {
    await apiDelete(`/api/admin/students/${id}`)
    return true
  },
}

