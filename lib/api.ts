import axios from "axios"
import { getCookie } from "./cookies"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getCookie("accessToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api

