import React, { useState, useEffect, useContext } from 'react'
import { useSnackbar } from 'notistack'

import { makeStyles } from '@material-ui/core/styles'
import AddCircle from '@material-ui/icons/AddCircle'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'

import Table from './Table'
import Dialog from './Dialog'
import CenteredBox from './CenteredBox'


import {
  getHospitals,
  searchHospitals
} from '@healthapp/common/services/hospitals'

import useAddHospital from '@healthapp/common/hooks/useAddHospital'
import { displayName, displayAddress } from '@healthapp/common/utils'

import { UserContext } from '../context/UserContext'

const useStyles = makeStyles({
  header: {
    display: "inline-block",
  },
  headerAdd: {
    display: "inline-block",
    position: "relative",
    right: -10
  },
})


const HospitalTable = (props) => {
  return <Table 
    colgroup={
      <colgroup>
        <col width="15%" />
        <col width="50%" />
        <col width="35%" />
      </colgroup>
    }
    paginationCount={props.hospitals?.data?.meta?.count}
    paginationPage={props.page}
    paginationNumberOfPages={props.hospitals?.data?.meta?.noPages}
    setPageHandler={props.setPage}
    openDoctorDialog={props.openDoctorDialog}
    headers={[
      "Id",
      "Naziv",
      "Adresa",
    ]}
    rows={props.hospitals?.data?.data.map(hospital => {
      return [
        hospital?.id,
        displayName(hospital),
        displayAddress(hospital?.address),
      ]
    })}
  />
}

const Hospitals = (props) => {
  const classes = useStyles()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [hospitals, setHospitals] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [searchName, setSearchName] = useState('')
  const [searchCity, setSearchCity] = useState('')

  const {
    name, 
    city,
    street, 
    setName,
    setCity, 
    setStreet,

    isAddingHospital, 
    isHospitalAdded,
    callAddHospital,
    setCallAddHospital,
    notValidAddHospital
  } = useAddHospital(
    () => {
      enqueueSnackbar('Ustanova je uspešno dodata', { 
        variant: 'success',
        autoHideDuration: 2000
      })
    }, 
    (error) => {
      enqueueSnackbar(`${error}`, { 
        variant: 'error',
        autoHideDuration: 2000
      })
    })

  const user = useContext(UserContext)

  const openDialog = _ => {
    setIsDialogOpen(true)
  }

  const closeDialog = _ => {
    setIsDialogOpen(false)
  }

  const getHospitalsFromAPI = async () => {
    setIsLoading(true)
    try {
      const hospitalRes = await getHospitals({pageNo: page === 1 ? 0 : page - 1})
      setSearchName('')
      setSearchCity('')
      setHospitals(hospitalRes)
      setIsLoading(false)
      closeDialog()
    } catch (error) {
      setHospitals(null)
      setIsLoading(false)
      closeDialog()
    }
  }

  const goSearch = async () => {
    setIsLoading(true)
    try {
      const hospitalRes = await searchHospitals({
        city: searchCity || undefined,
        name: searchName || undefined,
        pageNo: page === 1 ? 0 : page - 1
      })
      setHospitals(hospitalRes)
      setIsLoading(false)
      closeDialog()
    } catch (error) {
      setHospitals(null)
      setIsLoading(false)
      closeDialog()
    }
  }


  useEffect((_) => {
    getHospitalsFromAPI()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, user.user, page, isHospitalAdded])


  if (isLoading) {
    return <CenteredBox>
      <h1>Učitava se...</h1>
    </CenteredBox>
  }

  return (
    <div id="tabela-dialog-modal">
      <Dialog 
        open={isDialogOpen}
        title='Nova ustanova'
        onCancelLabel="Odustani"
        onDoneLabel="Dodaj"
        onClose={closeDialog}
        onCancel={closeDialog}
        disabledDone={notValidAddHospital || isAddingHospital}
        onDone={_ => setCallAddHospital(!callAddHospital)}
        content={<React.Fragment>
          <TextField 
            id="outlined-basic" 
            label="Naziv" 
            variant="outlined" 
            style={{marginTop: "20px"}}
            type="text"
            disabled={isAddingHospital}
            onChange={e => setName(e.target.value)} 
            value={name} 
          />
          <br />
          <TextField 
            id="outlined-basic" 
            label="Grad" 
            variant="outlined" 
            disabled={isAddingHospital}
            style={{marginTop: "20px"}}
            type="text"
            onChange={e => setCity(e.target.value)} 
            value={city} />
          <br />
          <TextField 
            id="outlined-basic" 
            label="Ulica" 
            variant="outlined" 
            disabled={isAddingHospital}
            style={{marginTop: "20px"}}
            type="text"
            onChange={e => setStreet(e.target.value)} 
            value={street} />
          <br />
          <br />
        </React.Fragment>}
      />
      <CenteredBox>
        <h1 className={classes.header}>Sve zdravstvene ustanove</h1>
        <AddCircle 
          className={classes.headerAdd} 
          onClick={_ => openDialog()} 
        />
      </CenteredBox>
     
      <CenteredBox>
        <TextField 
          size="small"
          id="outlined-basic" 
          label="Naziv" 
          variant="outlined" 
          style={{marginTop: "20px"}}
          type="text"
          disabled={isLoading}
          onChange={e => {
            setSearchCity('')
            setSearchName(e.target.value)
          }} 
          value={searchName} 
        />
        <TextField 
          id="outlined-basic" 
          size="small"
          label="Grad" 
          variant="outlined" 
          style={{marginTop: "20px"}}
          type="text"
          disabled={isLoading}
          onChange={e => {
            setSearchName('')
            setSearchCity(e.target.value)
          }} 
          value={searchCity} 
        />
      </CenteredBox>
        <br />
      <CenteredBox>
        <Button 
          variant="contained"
          text="OK"
          onClick={_ => goSearch()} 
          color="primary" 
          disabled={isLoading}
        >
          TRAŽI
        </Button>&nbsp;&nbsp;
        <Button 
          variant="contained"
          text="OK"
          onClick={_ => getHospitalsFromAPI()} 
          color="secondary" 
          disabled={isLoading}
        >
          SVE
        </Button>
       </CenteredBox>
       <br />

      {hospitals && hospitals?.data?.data?.length > 0 ? (
        <HospitalTable 
          hospitals={hospitals} 
          page={page} 
          setPage={setPage} 
        />
      ) : null}
    </div>
  )
}

export default Hospitals
