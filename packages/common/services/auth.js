import axios from 'axios'
import axiosDecorator from '../http'
import { routeByName } from '../utils'
import { setUserInStorage } from './storage'

const parseAuthorizationBearer = (res) => {
  if (!res.headers.authorization) return
  const headerParts = res.headers.authorization.split(' ')
  if (headerParts[0].toLowerCase() === 'bearer') return headerParts[1]
}

const me = (data, storage) => {
  return axios
    .post('http://localhost:8080/login', data)
    .then((response) => {
      const token = parseAuthorizationBearer(response) || ''

      setUserInStorage({ token }, storage)
      return axiosDecorator(storage)
        .then(axiosInstance => {
          return axiosInstance
            .get(routeByName('api.me'))
            .then((res) => {
              setUserInStorage({ ...res.data, token }, storage)
              return res
            })
        })
    })
    .catch((e) => console.error(e))
}

export {
  me
}