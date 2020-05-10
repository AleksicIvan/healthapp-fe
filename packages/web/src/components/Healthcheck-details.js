import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment'
import { useParams } from 'react-router-dom'

import { getCheckDetails } from '@healthapp/common/services/healthchecks'
import { displayName, displayAddress } from '@healthapp/common/utils'
import { UserContext } from '../context/UserContext'

const Report = (props) => {
  return (
    <div>
      <a href={props.s3FileUrl}>{props.s3FileUrl}</a>
    </div>
  )
}

const HealthcheckDetails = (props) => {
  const [healthcheck, setHealthcheck] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const user = useContext(UserContext)
  const { healthCheckId } = useParams()

  useEffect((_) => {
    const getHealthcheck = async () => {
      setIsLoading(true)

      try {
        const healthcheck = await getCheckDetails(user.user?.id, healthCheckId)
        setHealthcheck(healthcheck)
        setIsLoading(false)
      } catch (e) {
        setHealthcheck(null)
        setIsLoading(false)
      }
    }
    getHealthcheck()
  }, [healthCheckId, user.user]) // with pagination implemented arr will have page el

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <div>
      {healthcheck && (
        <div>
          <p>Id: {healthcheck?.data?.id}</p>
          <p>
            Datum: {moment(healthcheck?.data?.createdAt).format('DD.MM.YYYY')}
          </p>
          <p>Opis: {healthcheck?.data?.description}</p>
          <p>Lekar: {displayName(healthcheck?.data?.doctor)}</p>
          <p>
            Zdravstvena ustanova:{' '}
            {`${healthcheck?.data?.hospital?.name}, ${displayAddress(
              healthcheck?.data?.hospital?.address
            )}`}
          </p>
          <div>
            Izveštaji:{' '}
            {healthcheck?.data?.reports.map((r) => (
              <Report {...r} key={r.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HealthcheckDetails
