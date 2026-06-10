import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

function getToken() {
  return localStorage.getItem('erp_token')
}

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function apiGet(url, config) {
  return apiClient.get(url, config).then((r) => r.data)
}

export async function apiPost(url, body, config) {
  return apiClient.post(url, body, config).then((r) => r.data)
}

export async function apiPut(url, body, config) {
  return apiClient.put(url, body, config).then((r) => r.data)
}

export async function apiDelete(url, config) {
  return apiClient.delete(url, config).then((r) => r.data)
}

