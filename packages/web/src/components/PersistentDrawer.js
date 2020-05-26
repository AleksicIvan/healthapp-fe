import React from 'react'
import clsx from 'clsx'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import InfoIcon from '@material-ui/icons/Info'
import AccountCircle from '@material-ui/icons/AccountCircle'
import LocalHospitalIcon from '@material-ui/icons/LocalHospital'
import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption'
import LocalLibrary from '@material-ui/icons/LocalLibrary'
import LocalHotel from '@material-ui/icons/LocalHotel'

import MyAppBar from './AppBar'


const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}))

export default function PersistentDrawerLeft(props) {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const location = useLocation()
  const [open, setOpen] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <MyAppBar 
        location={location}
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        handleMenuClick={handleDrawerOpen}
        iconButtonClassName={clsx(classes.menuButton, open && classes.hide)}
      />
      {/* <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Persistent drawer
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>

          <ListItem button onClick={_ => {
            handleDrawerClose()
            history.push('/')
            }}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Naslovna" />
          </ListItem>

          <ListItem button onClick={_ => {
            handleDrawerClose()
            history.push('/profil')
            }}>
            <ListItemIcon><AccountCircle /></ListItemIcon>
            <ListItemText primary="Korisnički profil" />
          </ListItem>

          <ListItem button onClick={_ => {
            handleDrawerClose()
            history.push('/pregledi')
          }}>
            <ListItemIcon><LocalHospitalIcon /></ListItemIcon>
            <ListItemText primary="Moji pregledi" />
          </ListItem>

          <ListItem button onClick={_ => {
            handleDrawerClose()
            history.push('/lekari')
          }}>
            <ListItemIcon><EnhancedEncryptionIcon /></ListItemIcon>
            <ListItemText primary="Svi lekari" />
          </ListItem>

          <ListItem button onClick={_ => {
            handleDrawerClose()
            history.push('/specijalizacije')
          }}>
            <ListItemIcon><LocalLibrary /></ListItemIcon>
            <ListItemText primary="Sve specijalizacije" />
          </ListItem>

          <ListItem button onClick={_ => {
            handleDrawerClose()
            history.push('/zdravstvene-ustanove')
          }}>
            <ListItemIcon><LocalHotel /></ListItemIcon>
            <ListItemText primary="Sve zdr. ustanove" />
          </ListItem>

          <ListItem button onClick={_ => {
            handleDrawerClose()
            history.push('/o-nama')
          }}>
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary="O nama" />
          </ListItem>

        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {props.children}
      </main>
    </div>
  )
}