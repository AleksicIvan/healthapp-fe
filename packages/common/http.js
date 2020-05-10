import axios from 'axios'
import { getUserFromStorage } from './services/storage'

const axiosDecorator = (storage) => {
  const instance = axios.create({
    baseURL: 'http://localhost:8080',
  })
  return new Promise((resolve, reject) => {
    getUserFromStorage(storage)
      .then(user => {
        const token = user.token

        if (!token) {
          resolve(instance)
        } else {
          instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
          resolve(instance)
        }
      })
  })
}

export default axiosDecorator
