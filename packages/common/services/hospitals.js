import axiosDecorator from '../http'
import { routeByName } from '../utils'


const getHospitals = (filters) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .get(routeByName(['api.hospitals']), {
          params: {
            ...filters
          }
        })
    })
    .catch((e) => console.error(e))
}

const getAllHospitals = (filters) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .get(routeByName(['api.hospitals.all']), {
          params: {
            ...filters
          }
        })
    })
    .catch((e) => console.error(e))
}


const addHospital = (data) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .post(routeByName(['api.hospitals.create']), data)
    })
    .catch((e) => {
      throw 'Sva polja moraju biti popunjena'
      console.error(e)
    })
}

const updateHospital = (data) => {
  // return axiosDecorator(localStorage)
  //   .then(axiosInstance => {
  //     return axiosInstance
  //       .put(routeByName(['api.doctors.update']), data)
  //   })
  //   .catch((e) => {
  //     throw 'Došlo je do problema prilikom ažuriranja lekara'
  //     console.error(e)
  //   })
}

const searchHospitals = (filters) => {
  return axiosDecorator(localStorage)
      .then(axiosInstance => {
        return axiosInstance
          .get(routeByName(['api.hospitals.search']), {
            params: {
              ...filters
            }
          })
      })
    .catch((e) => console.error(e))
}


export {
  getHospitals,
  getAllHospitals,
  addHospital,
  updateHospital,
  searchHospitals
}