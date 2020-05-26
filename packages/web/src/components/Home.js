import React from 'react'
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles"

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//   },
//   appBar: {
//     zIndex: theme.zIndex.drawer + 1,
//   },
//   drawer: {
//     width: drawerWidth,
//     flexShrink: 0,
//   },
//   drawerPaper: {
//     width: drawerWidth,
//   },
//   drawerContainer: {
//     overflow: 'auto',
//   },
//   content: {
//     flexGrow: 1,
//     padding: theme.spacing(3),
//   },
// }))

export default (props) => {
  return (
    <div>
      <h1>Dobro došli u Nazdravlje aplikaciju</h1>
      <div>Vaše zdravlje u Vašim rukama</div>
    </div>
  )
}