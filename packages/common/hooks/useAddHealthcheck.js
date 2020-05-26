import { useState, useEffect } from 'react'

import { addCheck } from '@healthapp/common/services/healthchecks'

export default (user, onSuccess, onError) => {
  const [rating, setRating] = useState(0)
  const [doctorRating, setDoctorRating] = useState(0)
  const [noOfRatings, setNoOfRatings] = useState(0)
  const [allRatings, setAllRatings] = useState(0)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [healthcheckDate, setHealthcheckDate] = useState(null)
  const [healthcheckDescription, setHealthcheckDescription] = useState('')
  const [healthCheckAdded, setHealthCheckAdded] = useState(false)
  const [callAddHealthcheck, setCallAddHealthcheck] = useState(false)

  const notValidAddHealthcheck = !selectedHospital || !selectedDoctor || !healthcheckDate || !rating


  const handleCreateHealthcheck = async _ => {
    try {
      let response = await addCheck({
        user: {
          id: user.user?.id
        },
        doctorRating,
        doctor: {
          ...selectedDoctor,
          noOfRatings,
          allRatings
        },
        hospital: {...selectedHospital},
        description: healthcheckDescription,
        createdAt: healthcheckDate
      })
      onSuccess()
      setHealthCheckAdded(!healthCheckAdded)
    } catch (error) {
      onError(error)
      setHealthCheckAdded(false)
    }
  }

  useEffect(() => {
    if (!notValidAddHealthcheck) {
      handleCreateHealthcheck()
    }
  }, [callAddHealthcheck])

  return {
    notValidAddHealthcheck,
    doctorRating,
    setDoctorRating,
    rating, 
    setRating,
    noOfRatings, 
    setNoOfRatings,
    allRatings, 
    setAllRatings,
    selectedDoctor, 
    setSelectedDoctor,
    selectedHospital, 
    setSelectedHospital,
    healthcheckDate, 
    setHealthcheckDate,
    healthcheckDescription, 
    setHealthcheckDescription,
    healthCheckAdded, 
    setHealthCheckAdded,
    callAddHealthcheck,
    setCallAddHealthcheck
  }
}