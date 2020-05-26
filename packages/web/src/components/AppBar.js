import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import { UserContext } from '../context/UserContext'
 
const doSmallFlexGrowRoutes = ['/pregledi', '/lekari', '/zdravstvene-ustanove', '/specijalizacije', '/']

const useStyles = pathname => makeStyles((theme) => {
  return {
    root: {
      flexGrow: doSmallFlexGrowRoutes.includes(pathname) ? 0.2 : 0.8,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }
})

function AuthCTA () {
  const history = useHistory()
  const user = useContext(UserContext)

 return user?.isAuthenticated
    ? <Box>
        <Button 
          color="inherit"
          onClick={_ => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            user.dispatch({type: "REMOVE_USER", payload: null})
            history.replace('/')
          }}
        >
        Odjava
      </Button>
        <small>
          {user?.user?.username}
        </small>
    </Box>
    : <Button 
        color="inherit"
        onClick={_ => {
          history.replace('/prijava')
        }}
      >
        Prijava
  </Button>
}

export default function ButtonAppBar (props) {
  const classes = useStyles(props.location.pathname)()
  // const location = useLocation()

  return (
    <div className={classes.root} id="pb"> 
      <AppBar position={props.position} className={props.className} >
        <Toolbar>
          <IconButton edge="start" className={props.menuButton} color="inherit" aria-label="menu" onClick={_ => props.handleMenuClick()}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
          
          </Typography>
          <AuthCTA />
        </Toolbar>
      </AppBar>
    </div>
  )
}