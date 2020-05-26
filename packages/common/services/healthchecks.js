import axiosDecorator from '../http'
import { routeByName } from '../utils'



const getChecks = (userId, filters) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .get(routeByName(['api.healthchecks'], { userId }), {
          params: {
            ...filters
          }
        })
    })
    .catch((e) => console.error(e))
}

const searchChecks = (filters = {}) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .get(routeByName(['api.healthchecks.search']), {
          params: {
            ...filters
          }
        })
    })
    .catch((e) => console.error(e))
}

const addCheck = (data) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .post(routeByName(['api.healthchecks.create']), data)
    })
    .catch((e) => {
      throw 'Sva polja moraju biti popunjena'
      console.error(e)
    })
}

const updateCheck = (data) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .put(routeByName(['api.healthchecks.update']), data)
    })
    .catch((e) => {
      throw 'Došlo je do problema prilikom ažuriranja pregleda'
      console.error(e)
    })
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

const deleteHealthcheck = (healthCheckId) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .delete(routeByName(['api.healthchecks.delete'], {healthCheckId}))
    })
    .catch((e) => {
      throw 'Doslo je do greske prilikom brisanja.'
      console.error(e)
    })
}


export {
  addCheck,
  updateCheck,
  getChecks,
  searchChecks,
  getCheckDetails,
  deleteHealthcheck
}
