import http from '../utils/http'

class UserApi {
  static getListUser = () => http.get('/user?limit=1000')
  static getSummary = () => http.get('/user/summary')
  static createUser = (body) => http.post('/user', body)
  static getUser = (id) => http.get(`/user/${id}`)
  static updateUser = (id, body) => http.patch(`/user/${id}`, body)
  static deleteUser = (id) => http.delete(`/user/${id}`)
}

export default UserApi
