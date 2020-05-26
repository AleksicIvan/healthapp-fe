import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'


const useStyles = makeStyles({
  rightEm: {
    flexDirection: "column",
    display: "flex",
    justifyContent: "right",
    alignItems: "flex-end"
  }
})

export default function CenteredBox ({ children }) {
  const classes = useStyles()

  return <Box className={classes.rightEm}>
    {children}
  </Box>
}


