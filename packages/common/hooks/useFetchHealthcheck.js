import { useState, useEffect } from 'react'

import { getChecks } from '@healthapp/common/services/healthchecks'


export default ({user, healthCheckAdded, onSuccess, onError}) => {
  const [healthchecksAPI, setHealthchecksAPI] = useState(null)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [shouldFetchHealthchecks, setShouldFetchHealthchecks] = useState(true)

  useEffect((_) => {
    const getHealthchecks = async () => {
      setIsLoading(true)
      try {
        const healthchecksRes = await getChecks(user.user?.id, {pageNo: page === 1 ? 0 : page - 1})
        setHealthchecksAPI(healthchecksRes)
        onSuccess(healthchecksRes)
        setIsLoading(false)
      } catch (error) {
        setHealthchecksAPI(null)
        setIsLoading(false)
        onError(error)
      }
    }
    getHealthchecks()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, healthCheckAdded, shouldFetchHealthchecks])

  return {healthchecksAPI, isLoading, setIsLoading, page, setPage, shouldFetchHealthchecks, setShouldFetchHealthchecks}
}