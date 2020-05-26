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
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './components/Profile'
import Doctors from './components/Doctors'
import Specializations from './components/Specializations'
import Hospitals from './components/Hospitals'
import Healthchecks from './components/Healthchecks'
import HealthcheckDetails from './components/Healthcheck-details'
import AppBar from './components/AppBar'
import ResponsiveDrawer from './components/ResponsiveDrawer'
import PersistentDrawer from './components/PersistentDrawer'

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

function App() {
  const user = useContext(UserContext)

  return (
    <Router>

      <PersistentDrawer>

        <Route path="/" exact component={Home} />
        <Route path="/o-nama" component={About} />

        <PrivateRoute path="/pregledi" exact>
          <Route path="/pregledi" component={Healthchecks} />
        </PrivateRoute>

        <PrivateRoute path="/profil">
          <Route path="/profil" component={Profile} />
        </PrivateRoute>

        <PrivateRoute path="/lekari">
          <Route path="/lekari" component={Doctors} />
        </PrivateRoute>

        <PrivateRoute path="/specijalizacije">
          <Route path="/specijalizacije" component={Specializations} />
        </PrivateRoute>

        <PrivateRoute path="/zdravstvene-ustanove">
          <Route path="/zdravstvene-ustanove" component={Hospitals} />
        </PrivateRoute>

        <PrivateRoute path="/pregledi/:healthCheckId" exact>
          <Route
            path="/pregledi/:healthCheckId"
            component={HealthcheckDetails}
          />
        </PrivateRoute>

        <Route path="/prijava" exact component={Login} />
        <Route path="/prijava/novi-korisnik" component={Signup} />

      </PersistentDrawer>
    </Router>
  )
}

export default App
