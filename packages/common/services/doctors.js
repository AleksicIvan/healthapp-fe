import axiosDecorator from '../http'
import { routeByName } from '../utils'

const getDoctors = (filters) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .get(routeByName(['api.doctors']), {
          params: {
            ...filters
          }
        })
    })
    .catch((e) => console.error(e))
}

const getSpecializations = (filters) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .get(routeByName(['api.specializations']), {
          params: {
            ...filters
          }
        })
    })
    .catch((e) => console.error(e))
}

const searchSpecializations = (filters) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .get(routeByName(['api.specializations.search']), {
          params: {
            ...filters
          }
        })
    })
    .catch((e) => console.error(e))
}

const getAllSpecializations = (filters) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .get(routeByName(['api.specializations.all']), {
          params: {
            ...filters
          }
        })
    })
    .catch((e) => console.error(e))
}


const addDoctor = (data) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .post(routeByName(['api.doctors.create']), data)
    })
    .catch((e) => {
      throw 'Sva polja moraju biti popunjena'
      console.error(e)
    })
}

const updateDoctor = (data) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .put(routeByName(['api.doctors.update'], {doctorId: data.id}), data)
    })
    .catch((e) => {
      throw 'Došlo je do problema prilikom ažuriranja lekara'
      console.error(e)
    })
}


const searchDoctors = (filters = {}) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .get(routeByName(['api.doctors.search']), {
          params: {
            ...filters
          }
        })
    })
    .catch((e) => console.error(e))
}


const searchDoctorsWithPagination = (filters = {}) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .get(routeByName(['api.doctors.paged.search']), {
          params: {
            ...filters
          }
        })
    })
    .catch((e) => console.error(e))
}


export {
  getDoctors,
  searchDoctors,
  searchDoctorsWithPagination,
  addDoctor,
  updateDoctor,
  searchSpecializations,
  getSpecializations,
  getAllSpecializations
}