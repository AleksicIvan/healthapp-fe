import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useLocation, Redirect } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

import { UserContext } from '../context/UserContext'
import { me } from '@healthapp/common/services/auth'
import { addUser } from '@healthapp/common/services/user'


const Signup = (props) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [addressCity, setAddressCity] = useState('')
  const [addressStreet, setAddressStreet] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const user = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()

  const { from } = location.state || { from: { pathname: '/' } }

  if (user?.user) {
    return <Redirect to={from} />
  }

  const notValid = !firstName || !lastName || !email || !username || !password || !passwordRepeat || (password !== passwordRepeat) || !addressCity || !addressStreet
  return (
    <div>
      <TextField id="outlined-basic" label="Ime" variant="outlined" style={{marginTop: "20px"}}
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <br />
      <br />
      <TextField id="outlined-basic" label="Prezime" variant="outlined" style={{marginTop: "20px"}}
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <br />
      <br />
      <p>Addresa:</p>
      <TextField id="outlined-basic" label="Grad" variant="outlined" style={{marginTop: "20px"}}
        type="text"
        value={addressCity}
        onChange={(e) => setAddressCity(e.target.value)}
      />
      <br />
      <br />
      <TextField id="outlined-basic" label="Ulica" variant="outlined" style={{marginTop: "20px"}}
        type="text"
        value={addressStreet}
        onChange={(e) => setAddressStreet(e.target.value)}
      />
      <br />
      <br />
      <TextField id="outlined-basic" label="Korisničko ime" variant="outlined" style={{marginTop: "20px"}}
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <br />
      <TextField id="outlined-basic" label="Elektronska pošta" variant="outlined" style={{marginTop: "20px"}}
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
      <TextField id="outlined-basic" label="Potvrda šifre" variant="outlined"
        type="password"
        value={passwordRepeat}
        onChange={(e) => setPasswordRepeat(e.target.value)}
      />
      <br />
      <br />
      <Button variant="contained" color="primary"
        disabled={notValid}
        onClick={(_) => {
          let data = {
            firstName,
            lastName,
            username,
            email,
            password,
            address: {
              city: addressCity,
              street: addressStreet
            },
            roles: 'USER'
          }
          addUser(data)
            .then(res => {
              user.dispatch({type: "GET_USER_REQUEST", payload: null})
              me({ username, password }, localStorage)
                .then((res) => {
                  user.dispatch({type: "GET_USER_SUCCESS", payload: res.data})
                  history.replace(from)
                })
              .catch((e) => user.dispatch({type: "GET_USER_ERROR", payload: null}))
            })
        }}
      >
        Napravi nalog
      </Button>&nbsp;&nbsp;
      <Button variant="contained" color="primary"
        onClick={(_) => {
          history.replace('/prijava')
        }}
      >
        Prijavi se
      </Button>
    </div>
  )
}

export default Signup
