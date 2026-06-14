import axios from 'axios'
import toast from 'react-hot-toast'

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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, headers } = error.response
      if (status === 401) {
        localStorage.removeItem('erp_token')
        window.dispatchEvent(new Event('auth-token-changed'))
        toast.error('Session expired. Please log in again.', { id: 'auth-expired' })
      } else if (status === 429) {
        const retryAfter = headers['retry-after'] || headers['x-rate-limit-retry-after-seconds']
        if (retryAfter) {
          toast.error(`Too many requests. Please wait ${retryAfter} seconds and try again.`, { id: 'rate-limit' })
        } else {
          toast.error('Too many requests. Please try again later.', { id: 'rate-limit' })
        }
      }
    }
    return Promise.reject(error)
  }
)

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

