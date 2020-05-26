import axiosDecorator from '../http'
import { routeByName } from '../utils'

const addReport = (data) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .post(routeByName(['api.reports.create']), data)
    })
    .catch((e) => {
      throw 'Naziv dodatog izveštaja je neophodan.'
      console.error(e)
    })
}

const deleteReport = (reportId) => {
  return axiosDecorator(localStorage)
    .then(axiosInstance => {
      return axiosInstance
        .delete(routeByName(['api.reports.delete'], {reportId}))
    })
    .catch((e) => {
      throw 'Doslo je do greske prilikom brisanja.'
      console.error(e)
    })
}

export {
  addReport,
  deleteReport
}