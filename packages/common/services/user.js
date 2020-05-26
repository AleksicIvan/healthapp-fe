import axios from 'axios'
import axiosDecorator from '../http'
import { routeByName } from '../utils'

const addUser = (data) => {
  return axios
    .post('http://localhost:8080/api/users', data)
}

export {
  addUser
}