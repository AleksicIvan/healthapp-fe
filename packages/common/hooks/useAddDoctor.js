import { useState, useEffect } from 'react'

import { addDoctor } from '@healthapp/common/services/doctors'

export default (onSuccess, onError) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [specialization, setSpecialization] = useState(null)
  const [isDoctorAdded, setIsDoctorAdded] = useState(false)
  const [isAddingDoctor, setIsAddingDoctor] = useState(false)
  const [newDoctor, setNewDoctor] = useState(null)
  const [callAddDoctor, setCallAddDoctor] = useState(false)

  const newDoctorData = {
    firstName,
    lastName,
    specialization: {
      id: specialization?.id
    },
    noOfRatings: 0,
    rating: 0
  }

  const notValidAddDoctor = !firstName || !lastName || !specialization

  const resetFormState = () => {
    setSpecialization(null)
    setFirstName('')
    setLastName('')
  }

  const addNewDoctor = async _ => {
    try {
      setIsAddingDoctor(true)
      let response = await addDoctor(newDoctorData)

      setIsAddingDoctor(false)
      setIsDoctorAdded(!isDoctorAdded)
      resetFormState()
      setNewDoctor(response?.data)
      onSuccess(response?.data)
    } catch (error) {
      onError(error)
      setIsAddingDoctor(false)
      setIsDoctorAdded(!isAddingDoctor)
    }
  }

  useEffect(() => {
    if (!notValidAddDoctor) {
      addNewDoctor()
    }
  }, [callAddDoctor])

  return {
    firstName, 
    setFirstName,
    lastName, 
    setLastName,
    specialization, 
    setSpecialization,

    newDoctor, 
    isAddingDoctor, 
    isDoctorAdded,
    callAddDoctor,
    setCallAddDoctor,
    notValidAddDoctor
  }
}
