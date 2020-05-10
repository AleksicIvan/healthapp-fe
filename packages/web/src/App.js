import React, { useContext, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  Link,
  useHistory,
  useLocation
} from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Home from './components/Home'
import About from './components/About'
import Healthchecks from './components/Healthchecks'
import HealthcheckDetails from './components/Healthcheck-details'

import Login from './components/Login'
import './App.css'
import { UserContext } from './context/UserContext'

const PrivateRoute = ({ children, ...rest }) => {
  const user = useContext(UserContext)
  return (
    <Route
      {...rest}
      render={({ location }) => {
        console.log('user', user)
        return user.user !== null ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/prijava',
              state: { from: location },
            }}
          />
        )
      }}
    />
  )
}


const SignoutButton = (props) => {
  const user = useContext(UserContext)
  let history = useHistory()
  return (
    <div>
      <Button variant="contained" color="primary"
        onClick={() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          user.dispatch({type: "REMOVE_USER", payload: null})
          history.replace('/')
        }}
      >
        Signout
      </Button>
    </div>
  )
}

const LoginButton = (props) => {
  let history = useHistory()
  return (
    <div>
      <Button variant="contained" color="primary"
        onClick={() => {
          history.replace('/login')
        }}
      >
        Login
      </Button>
    </div>
  )
}

const AuthButtons = props => {
  const location = useLocation()
  return props.user?.user
    ? <SignoutButton />
    : location.pathname !== '/prijava'
      ? <LoginButton />
      : null
}


function App() {
  const user = useContext(UserContext)

  return (
    <Router>
        <ul style={{ listStyleType: 'none' }}>
          <li style={{ display: 'inline' }}>
            <Link to="/">Početna</Link>&nbsp;
          </li>
          <li style={{ display: 'inline' }}>
            <Link to="/o-nama">O nama</Link>&nbsp;
          </li>

          <li style={{ display: 'inline' }}>
            <Link to="/pregledi">Moji pregledi</Link>&nbsp;
          </li>

          <li style={{ display: 'inline' }}>
            <AuthButtons  user={user} />
          </li>
        </ul>

      <Route path="/" exact component={Home} />
      <Route path="/o-nama" component={About} />
      <PrivateRoute path="/pregledi" exact>
        <Route path="/pregledi" component={Healthchecks} />
      </PrivateRoute>
      <PrivateRoute path="/pregledi/:healthCheckId" exact>
        <Route
          path="/pregledi/:healthCheckId"
          component={HealthcheckDetails}
        />
      </PrivateRoute>
      <Route path="/prijava" component={Login} />
    </Router>
  )
}

export default App
