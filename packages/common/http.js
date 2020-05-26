import axios from 'axios'
import { getUserFromStorage } from './services/storage'

const getAxiosWithInterceptor = _ => {
  const instance = axios.create({
    baseURL: 'http://localhost:8080',
  })

  instance.interceptors.response.use((response) => {
    return response;
    }, (error) => {
      return Promise.reject(error)
  })

  return instance
}


const axiosDecorator = (storage) => {
  return new Promise((resolve, reject) => {
    getUserFromStorage(storage)
      .then(user => {
        const token = user.token
        if (!token) {
          resolve(getAxiosWithInterceptor())
        } else {
          const inst = getAxiosWithInterceptor()
          inst.defaults.headers.common['Authorization'] = `Bearer ${token}`
          resolve(inst)
        }
      })
  })
}

export default axiosDecorator
