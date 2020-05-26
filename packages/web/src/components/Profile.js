import React, { useState, useEffect, useContext } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import { displayAddress } from '@healthapp/common/utils'
import { UserContext } from '../context/UserContext'


const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 400
  }
})


const Profile = props => {
  const classes = useStyles()
  const userData = useContext(UserContext)
  const user = userData?.user

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5">Identifikator korisnika:{' '}</Typography>
        <Typography>{user?.id}</Typography>
        <br />
        <Typography variant="h5">Ime:{' '}</Typography>
        <Typography>{user?.firstName}</Typography>
        <br />
        <Typography variant="h5">Prezime:{' '}</Typography>
        <Typography>{user?.lastName}</Typography>
        <br />
        <Typography variant="h5">Adresa:{' '}</Typography>
        <Typography>{displayAddress(user?.address)}</Typography>
        <br />
        <Typography variant="h5">Korisničko ime:{' '}</Typography>
        <Typography>{user?.username}</Typography>
        <br />
        <Typography variant="h5">Elektronska pošta:{' '}</Typography>
        <Typography>{user?.email}</Typography>
        <br />
      </CardContent>
    </Card>
  )
}

export default Profile