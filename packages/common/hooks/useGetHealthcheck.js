import { useState, useEffect } from 'react'

import { getCheckDetails } from '@healthapp/common/services/healthchecks'

export default (userId, healthCheckId, onSuccess, onError) => {
  const [isLoadingHealthcheck, setIsLoadingHealthcheck] = useState(false)
  const [callGetCheck, setCallGetCheck] = useState(false)

  const getHealthcheck = async () => {
    setIsLoadingHealthcheck(true)

    try {
      const healthcheck = await getCheckDetails(userId, healthCheckId)
      onSuccess(healthcheck?.data)
      setIsLoadingHealthcheck(false)
    } catch (e) {
      setIsLoadingHealthcheck(false)
    }
  }

  useState(() => {
    if (healthCheckId && userId) {
      getHealthcheck()
    }
  }, [callGetCheck])

  return {
    isLoadingHealthcheck,
    callGetCheck,
    setCallGetCheck
  }
}