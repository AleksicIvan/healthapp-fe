import axiosDecorator from '../http'
import { routeByName } from '../utils'

const uploadToS3 = (userId, healthCheckId, file) => {
  const formData = new FormData()
  formData.append("file", file)
  return axiosDecorator(localStorage)
    .then(axiosInstance => {

      return axiosInstance
        .post(routeByName(['api.file_upload'], { userId, healthCheckId }), formData)
        // .then(r => {
        //   console.log('file uploaded succesfully')
        //   return r
        // })
        // .catch(err => {
        //   console.error('err', err)
        // })
    })
    .catch((e) => console.error(e))
  return Promise.resolve({})
}


export {
  uploadToS3,
}