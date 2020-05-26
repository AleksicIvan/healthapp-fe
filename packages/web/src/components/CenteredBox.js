import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'


const useStyles = makeStyles({
  centerEm: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
})

export default function CenteredBox ({ children }) {
  const classes = useStyles()

  return <Box className={classes.centerEm}>
    {children}
  </Box>
}


