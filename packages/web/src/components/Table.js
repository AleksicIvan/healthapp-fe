import React from 'react'
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import TableFooter from '@material-ui/core/TableFooter'
import TablePagination from '@material-ui/core/TablePagination'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'

import CenteredBox from './CenteredBox'


const StyledTableCell = withStyles((theme) => {
  return {
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }
})(TableCell)

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  paginationRow: {

  }
}))(TableRow)


const getRows = (rows = []) => {  
  return rows.map((row, i) => {
    return <StyledTableRow key={i}>
      {row.map((r, index) => {
        return index === 0
          ? <StyledTableCell key={index} component="th" scope="row">{r}</StyledTableCell>
          : <StyledTableCell key={index} align="left">{r}</StyledTableCell>
      })}
    </StyledTableRow>
  })
}

const getColumnHeaders = (headers = []) => {
  return headers.map((h, i) => {
    if (i === 0) {
      return <StyledTableCell key={i}>{h}</StyledTableCell>
    } else {
      return <StyledTableCell key={i} align="left">{h}</StyledTableCell>
    }
  })
}

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
})


const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));


function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, onChangePage, paginationNumberOfPages } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 1);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, paginationNumberOfPages);
  };

  return (
    <React.Fragment>
      <p>{`${page} / ${paginationNumberOfPages}`}</p>
      <div className={classes.root}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 1}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>

        <IconButton 
          onClick={handleBackButtonClick} 
          disabled={page === 1} 
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>

        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= paginationNumberOfPages}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= paginationNumberOfPages}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    </React.Fragment>
  );
}

export default function CustomizedTables({ 
  headers, 
  rows, 
  colgroup,
  paginationCount,
  paginationPage,
  paginationNumberOfPages,
  setPageHandler
}) {
  const classes = useStyles()

  const handleChangePage = (event, newPage) => {
    setPageHandler(newPage)
  }

  const rowsPerPage = rows?.length - 1

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        {colgroup}
        <TableHead>
          <TableRow>
            {getColumnHeaders(headers)}
          </TableRow>
        </TableHead>
        <TableBody>
          {getRows(rows)}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[]}
              rowsPerPage={rowsPerPage}
              count={paginationCount}
              paginationNumberOfPages={paginationNumberOfPages}
              page={paginationPage}
              onChangePage={handleChangePage}
              ActionsComponent={props => {
                return TablePaginationActions({...props, paginationNumberOfPages})
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}