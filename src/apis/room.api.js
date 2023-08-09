import http from '../utils/http'

class RoomApi {
  static createRoom = (body) => http.post('/room', body)
  static getRooms = (id) => http.get(`/room?limit=2000&building=${id}`)
  static getRoom = (id) => http.get(`/room/${id}`)
  static updateRoom = (id, body) => http.patch(`/room/${id}`, body)
  static deleteRoom = (id) => http.delete(`/room/${id}`)
}

export default RoomApi
