import axiosDecorator from '../http'
import { routeByName } from '../utils'



const getChecks = (userId) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .get(routeByName(['api.healthchecks'], { userId }))
    })
    .catch((e) => console.error(e))
}

const getCheckDetails = (userId, healthCheckId) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .get(
          routeByName('api.healthchecks.get_healthcheck', {
            userId,
            healthCheckId,
          })
        )
    })
    .catch((e) => console.error(e))
}

const getDoctors = (data) => {
  return axiosDecorator(localStorage)
      .then(axiosInstance => {
        return axiosInstance
        .get('api.doctors')
      })
    .catch((e) => console.error(e))
}


export {
  getDoctors,
  getChecks,
  getCheckDetails
}
