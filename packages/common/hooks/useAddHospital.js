import { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'

import { addHospital } from '@healthapp/common/services/hospitals'

export default (onSuccess, onError) => {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
  const [isHospitalAdded, setIsHospitalAdded] = useState(false)
  const [isAddingHospital, setIsAddingHospital] = useState(false)
  const [newHospital, setNewHospital] = useState(null)
  const [callAddHospital, setCallAddHospital] = useState(false)

  const newHospitalData = {
    name,
    address: {
      city,
      street
    }
  }

  const notValidAddHospital = !name || !city || !street

  const resetFormState = () => {
    setName('')
    setCity('')
    setStreet('')
  }

  const addNewHospital = async _ => {
    try {
      setIsAddingHospital(true)
      let response = await addHospital(newHospitalData)

      setIsAddingHospital(false)
      setIsHospitalAdded(!isHospitalAdded)
      resetFormState()
      setNewHospital(response?.data)
      onSuccess(response?.data)
    } catch (error) {
      onError(error)
      setIsAddingHospital(false)
      setIsHospitalAdded(!isAddingHospital)
    }
  }

  useEffect(() => {
    if (!notValidAddHospital) {
      addNewHospital()
    }
  }, [callAddHospital])

  return {
    name, 
    city,
    street, 
    setName,
    setCity, 
    setStreet,

    newHospital, 
    isAddingHospital, 
    isHospitalAdded,
    callAddHospital,
    setCallAddHospital,
    notValidAddHospital
  }
}
