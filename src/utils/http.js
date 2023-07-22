import axios from 'axios'
import Auth from './auth'
import { message } from 'antd'

class Http {
  constructor() {
    this.accessToken = Auth.getTokenFromLs().access_token
    this.refreshToken = Auth.getTokenFromLs().refresh_token
    this.instance = axios.create({
      baseURL: 'http://localhost:8080/api/v1/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use((config) => {
      if (this.accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${this.accessToken}`
        return config
      }
      return config
    })
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === '/auth/signup' || url === '/auth/signin') {
          this.accessToken = response.data?.metadata?.tokens?.accessToken
          this.refreshToken = response.data?.metadata?.tokens?.refreshToken
          Auth.saveTokenToLs(response.data?.metadata?.tokens?.accessToken, response.data?.metadata?.tokens?.refreshToken)
          Auth.setProfileToLS(response.data?.metadata?.user)
          Auth.setPermissionsToLS(response?.data?.metadata?.permissions)
        } else if (url === '/auth/signout') {
          this.accessToken = ''
          this.refreshToken = ''
          Auth.clearTokenFromLS()
          localStorage.clear()
        }
        return response
      },
      function (error) {
        const msg = error.response?.data?.message
        message.error(msg)
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
