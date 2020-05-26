import React, { useState, useEffect, useContext } from 'react'
import debounce from 'lodash/debounce'
import { useSnackbar } from 'notistack'

import { makeStyles } from '@material-ui/core/styles'
import AddCircle from '@material-ui/icons/AddCircle'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete'
import Button from '@material-ui/core/Button'

import Table from './Table'
import Dialog from './Dialog'
import CenteredBox from './CenteredBox'
import Rating from './Rating'

import {
  getDoctors,
  searchDoctorsWithPagination,
  getAllSpecializations 
} from '@healthapp/common/services/doctors'

import useAddDoctor from '@healthapp/common/hooks/useAddDoctor'
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


const DoctorTable = (props) => {
  return <Table 
    colgroup={
      <colgroup>
        <col width="20%" />
        <col width="30%" />
        <col width="40%" />
        <col width="10%" />
      </colgroup>
    }
    paginationCount={props.doctors?.data?.meta?.count}
    paginationPage={props.page}
    paginationNumberOfPages={props.doctors?.data?.meta?.noPages}
    setPageHandler={props.setPage}
    openDoctorDialog={props.openDoctorDialog}
    headers={[
      "Ime",
      "Prezime",
      "Specijalizacija",
      "Ocena",
    ]}
    rows={props.doctors?.data?.data.map(doctor => {
      return [
        doctor?.firstName,
        doctor?.lastName,
        doctor?.specialization?.name,
        <Rating 
          readOnly
          value={doctor?.rating} 
        />     
      ]
    })}
  />
}

const DEFAULT_DEBOUNCE_WAIT = 1000

export default function Doctors (props) {
  const classes = useStyles()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [doctors, setDoctors] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [specializationOptions, setSpecializationOptions] = useState([])
  const [searchFullName, setSearchFullName] = useState('')
  const [searchSpecialization, setSearchSpecialization] = useState('')

  const {
    firstName, 
    setFirstName,
    lastName, 
    setLastName,
    setSpecialization,

    isAddingDoctor, 
    isDoctorAdded,
    callAddDoctor,
    setCallAddDoctor,
    notValidAddDoctor
  } = useAddDoctor(
    () => {
      enqueueSnackbar('Lekar je uspešno dodat', { 
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

  const getDoctorsFromAPI = async () => {
    setIsLoading(true)
    try {
      const doctorsRes = await getDoctors({pageNo: page === 1 ? 0 : page - 1})
      setSearchFullName('')
      setSearchSpecialization('')
      setDoctors(doctorsRes)
      setIsLoading(false)
      closeDialog()
    } catch (error) {
      setDoctors(null)
      setIsLoading(false)
      closeDialog()
    }
  }

  const goSearch = async () => {
    setIsLoading(true)
    try {
      const doctorsRes = await searchDoctorsWithPagination({
        fullName: searchFullName || undefined,
        specialization: searchSpecialization || undefined,
        pageNo: page === 1 ? 0 : page - 1
      })
      setDoctors(doctorsRes)
      setIsLoading(false)
      closeDialog()
    } catch (error) {
      setDoctors(null)
      setIsLoading(false)
      closeDialog()
    }
  }


  useEffect((_) => {
    getDoctorsFromAPI()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, user.user, page, isDoctorAdded])


  const handleSearchSpecializations = (searchParam, wait = DEFAULT_DEBOUNCE_WAIT) => {
    if (specializationOptions.length > 0) {
      return
    }
    
    debounce(async _ => {
      try {
        const specs = await getAllSpecializations()
        setSpecializationOptions(specs?.data)
      } catch (error) {
        
      }
    }, wait)()
  }

  if (isLoading) {
    return <CenteredBox>
      <h1>Učitava se...</h1>
    </CenteredBox>
  }

  return (
    <div id="tabela-dialog-modal">
      <Dialog 
        open={isDialogOpen}
        title='Novi lekar'
        onCancelLabel="Odustani"
        onDoneLabel="Dodaj"
        onClose={closeDialog}
        onCancel={closeDialog}
        disabledDone={notValidAddDoctor || isAddingDoctor}
        onDone={_ => setCallAddDoctor(!callAddDoctor)}
        content={<React.Fragment>
          <TextField 
            id="outlined-basic" 
            label="Ime" 
            variant="outlined" 
            style={{marginTop: "20px"}}
            type="text"
            disabled={isAddingDoctor}
            onChange={e => setFirstName(e.target.value)} 
            value={firstName} 
          />
          <br />
          <TextField 
            id="outlined-basic" 
            label="Prezime" 
            variant="outlined" 
            disabled={isAddingDoctor}
            style={{marginTop: "20px"}}
            type="text"
            onChange={e => setLastName(e.target.value)} 
            value={lastName} />
          <br />
          <Autocomplete
            id="specialization"
            label="Specijalizacija" 
            freeSolo
            disabled={isAddingDoctor}
            getOptionLabel={v => v.name}
            onInputChange={(event, value) => handleSearchSpecializations({name: value})}
            onHighlightChange={(event, option) => setSpecialization(option)}
            options={specializationOptions}
            renderInput={(params) => (
              <TextField {...params} label="Specijalizacija" margin="normal" variant="outlined" />
            )}
           />
          <br />
          <br />
        </React.Fragment>}
      />
      <CenteredBox>
        <h1 className={classes.header}>Svi lekari</h1>
        <AddCircle 
          className={classes.headerAdd} 
          onClick={_ => openDialog()} 
        />
      </CenteredBox>
     
      <CenteredBox>
        <TextField 
          size="small"
          id="outlined-basic" 
          label="Ime" 
          variant="outlined" 
          style={{marginTop: "20px"}}
          type="text"
          disabled={isLoading}
          onChange={e => {
            setSearchSpecialization('')
            setSearchFullName(e.target.value)
          }} 
          value={searchFullName} 
        />
        <TextField 
          id="outlined-basic" 
          size="small"
          label="Specijalizacija" 
          variant="outlined" 
          style={{marginTop: "20px"}}
          type="text"
          disabled={isLoading}
          onChange={e => {
            setSearchFullName('')
            setSearchSpecialization(e.target.value)
          }} 
          value={searchSpecialization} 
        />
      </CenteredBox>
      <br />
      <CenteredBox>
        <Button 
          variant="contained"
          onClick={_ => goSearch()} 
          color="primary" 
          disabled={isLoading}
        >
          TRAŽI
        </Button>&nbsp;&nbsp;
        <Button 
          variant="contained"
          onClick={_ => getDoctorsFromAPI()} 
          color="secondary" 
          disabled={isLoading}
        >
          SVI
        </Button>
       </CenteredBox>
       <br />
       <br />

      {doctors && doctors?.data?.data?.length > 0 ? (
        <DoctorTable 
          doctors={doctors} 
          page={page} 
          setPage={setPage} 
        />
      ) : null}
    </div>
  )
}
