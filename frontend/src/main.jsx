import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import axios from 'axios'

const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

axios.interceptors.response.use(
  response => response,
  error => {
    const url = error.config?.url || ''
    if (error.response && error.response.status === 401 && !url.includes('/api/auth/me')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
