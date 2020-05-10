import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { getChecks } from '@healthapp/common/services/healthchecks'
import { displayName } from '@healthapp/common/utils'
import { UserContext } from '../context/UserContext'


const HealthCheckTable = (props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Lekar</th>
          <th>Opis</th>
          <th>Gde</th>
          <th>Kada</th>
          <th>Detalji</th>
        </tr>
      </thead>
      <tbody>
        {props.healthchecks?.data.map((check) => {
          return (
            <tr key={check.id}>
              <td>{displayName(check?.doctor)}</td>
              <td>{check?.description}</td>
              <td>{check?.hospital?.name}</td>
              <td>{moment(check?.createdAt).format('DD.MM.YYYY')}</td>
              <td>
                <Link to={`/pregledi/${check.id}`}>DETALJI</Link>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const Healthchecks = (props) => {
  const [healthchecks, setHealthchecks] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const user = useContext(UserContext)

  useEffect((_) => {
    const getHealthchecks = async () => {
      setIsLoading(true)
      try {
        const healthchecks = await getChecks(user.user?.id)
        console.log('healthchecks', healthchecks)
        setHealthchecks(healthchecks)
        setIsLoading(false)
      } catch (e) {
        setHealthchecks(null)
        setIsLoading(false)
      }
    }
    getHealthchecks()
  }, [user, user.user]) // with pagination implemented arr will have page el

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <div>
      <h1>Moji pregledi</h1>
      {healthchecks && healthchecks.data.length > 0 ? (
        <HealthCheckTable healthchecks={healthchecks} />
      ) : null}
    </div>
  )
}

export default Healthchecks
