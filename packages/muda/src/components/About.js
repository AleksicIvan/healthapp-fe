import React, { useContext } from 'react'

import { UserContext } from '../context/UserContext'

export default (props) => {
  const user = useContext(UserContext)

  return (
    <div>
      <h1>O nama</h1>
      {user.user === null ? (
        <div>Učitavanje...</div>
      ) : (
        <div>Lorem ipsum....</div>
      )}
    </div>
  )
}