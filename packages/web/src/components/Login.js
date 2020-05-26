import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useLocation, Redirect } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import CenteredBox from './CenteredBox'

import { UserContext } from '../context/UserContext'
import { me } from '@healthapp/common/services/auth'
import { setUserInStorage } from '@healthapp/common/services/storage'


const Login = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()

  const { from } = location.state || { from: { pathname: '/' } }

  if (user?.user) {
    return <Redirect to={from} />
  }
  return (
    // <Grid
    //   container
    //   direction="column"
    //   justify="center"
    //   alignItems="center"
    // >
    <div>
      <TextField id="outlined-basic" label="Korisničko ime" variant="outlined" style={{marginTop: "20px"}}
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <br />
      <TextField id="outlined-basic" label="Šifra" variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <Button variant="contained" color="primary"
        onClick={(_) => {
          user.dispatch({type: "GET_USER_REQUEST", payload: null})
          me({ username, password }, localStorage)
            .then((res) => {
              user.dispatch({type: "GET_USER_SUCCESS", payload: res.data})
              history.replace(from)
            })
          .catch((e) => user.dispatch({type: "GET_USER_ERROR", payload: null}))
        }}
      >
        Prijavi se
      </Button>&nbsp;&nbsp;
      <Button variant="contained" color="primary"
        onClick={(_) => {
          history.replace('/prijava/novi-korisnik')
        }}
      >
        Napravi nalog
      </Button>

    </div>
  )
}

export default Login
