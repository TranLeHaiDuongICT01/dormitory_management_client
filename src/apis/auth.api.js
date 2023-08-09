import Auth from '../utils/auth'
import http from '../utils/http'

class AuthApi {
  static registerAccount = (body) => http.post('/auth/signup', body)
  static loginAccount = (body) => http.post('/auth/signin', body)
  static logoutAccount = () =>
    http.post('/auth/signout', {
      refreshToken: Auth.getTokenFromLs().refresh_token
    })
  static updateProfile = (body) => http.patch('/auth/update-profile', body)
  static changePassword = (body) => http.patch('/auth/change-password', body)
  static forgotPassword = (body) => http.post('/auth/forgot-password', body)
  static resetPassword = (token, body) => http.post(`/auth/reset-password?token=${token}`, body)
}

export default AuthApi
