import http from '../utils/http'

class BuildingApi {
  static createBuilding = (body) => http.post('/building', body)
  static getBuildings = () => http.get('/building?limit=2000')
  static getBuilding = (id) => http.get(`/building/${id}`)
  static updateBuilding = (id, body) => http.patch(`/building/${id}`, body)
  static deleteBuilding = (id) => http.delete(`/building/${id}`)
}

export default BuildingApi
