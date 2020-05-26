import { useState, useEffect } from 'react'

import { updateCheck } from '@healthapp/common/services/healthchecks'

export default (onSuccess, onError) => {
  const [callUpdateCheck, setCallUpdateCheck] = useState(false)
  const [updatedHealthCheck, setUpdatedHealthCheck] = useState(null)
  const [dataForEdit, setDataForEdit] = useState(null)

  const handleSetDataForEdit = newData => {
    console.log('newData', newData)
    setDataForEdit(newData)
    setCallUpdateCheck(!callUpdateCheck)
  } 

  const handleCreateHealthcheck = async _ => {
    try {
      let response = await updateCheck(dataForEdit)
      onSuccess()
      setUpdatedHealthCheck(response?.data)
    } catch (error) {
      onError(error)
    }
  }

  useState(() => {
    if (dataForEdit) {
      handleCreateHealthcheck()
    }
  }, [callUpdateCheck])

  return {
    handleSetDataForEdit,
    updatedHealthCheck
  }
}