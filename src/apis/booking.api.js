import http from '../utils/http'

class BookingApi {
  static requestBooking = (body) => http.post('/booking/request-booking', body)
  static getMyBooking = () => http.get('/booking/my-booking')
  static cancelMyBooking = (id, body) => http.patch(`/booking/cancel/${id}`, body)
  static getBookings = (status) => http.get(`/booking?populate=user,room&status=${status}`)
  static cancelBooking = (id, body) => http.patch(`/booking/cancel-booking/${id}`, body)
  static acceptBooking = (id) => http.patch(`/booking/accept-booking/${id}`)
  static acceptPayment = (id) => http.patch(`/booking/accept-payment/${id}`)
  static quitRoom = (id, body) => http.patch(`/booking/quit-room/${id}`, body)
  static kickOutRoom = (id, body) => http.patch(`/booking/kick-out-room/${id}`, body)
}

export default BookingApi
