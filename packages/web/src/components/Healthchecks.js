import React, { useState, useEffect, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import moment from 'moment'
import debounce from 'lodash/debounce'
import { useSnackbar } from 'notistack'

import { makeStyles } from '@material-ui/core/styles'
import AddCircle from '@material-ui/icons/AddCircle'
import TextField from '@material-ui/core/TextField';
import DialogContentText from '@material-ui/core/DialogContentText';
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import { DatePicker } from '@material-ui/pickers'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'

import Rating from './Rating'
import Table from './Table'
import Dialog from './Dialog'
import CenteredBox from './CenteredBox'

import { searchDoctors } from '@healthapp/common/services/doctors'
import { getAllHospitals } from '@healthapp/common/services/hospitals'
import { searchUserChecks } from '@healthapp/common/services/healthchecks'

import { displayName, displayAddress } from '@healthapp/common/utils'
import { UserContext } from '../context/UserContext'
import useFetchHealthcheck from '@healthapp/common/hooks/useFetchHealthcheck'
import useAddHealthcheck from '@healthapp/common/hooks/useAddHealthcheck'


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


const HealthCheckTable = (props) => {
  return <Table 
    colgroup={
      <colgroup>
        <col width="20%" />
        <col width="40%" />
        <col width="20%" />
        <col width="10%" />
        <col width="10%" />
      </colgroup>
    }
    paginationCount={props.healthchecks?.data?.meta?.count}
    paginationPage={props.page}
    paginationNumberOfPages={props.healthchecks?.data?.meta?.noPages}
    setPageHandler={props.setPage}
    openHealthcheckDialog={props.openHealthcheckDialog}
    headers={[
      "Lekar",
      "Opis",
      "Gde",
      "Kada",
      "",
    ]}
    rows={props.healthchecks?.data?.data.map(check => {
      return [
        <React.Fragment>
        <div>
          {displayName(check?.doctor)}
        </div>
        <div>
          <small>
            <i>
              {check?.doctor?.specialization?.name}
            </i>
          </small>
        </div>
        </React.Fragment>,
        check?.description,
        <React.Fragment>
          <div>
            {check?.hospital?.name}
          </div>
          <div>
            <small>
              <i>
                {displayAddress(check?.hospital?.address)}
              </i>
            </small>
          </div>
        </React.Fragment>,
        <p>{moment(check?.createdAt).format("DD.MM.YYYY")}</p>,
        <Link
          color="primary" 
          component={RouterLink}
          to={`/pregledi/${check.id}`}
        >
          DETALJI
        </Link>
      ]
    })}
  />
}

const DEFAULT_DEBOUNCE_WAIT = 1000

const Healthchecks = (props) => {
  const user = useContext(UserContext)
  const classes = useStyles()
  const {   
    notValidAddHealthcheck, 
    doctorRating,
    setDoctorRating,
    rating, 
    setRating,
    setNoOfRatings,
    setAllRatings,
    selectedDoctor, 
    setSelectedDoctor,
    setSelectedHospital,
    healthcheckDate, 
    setHealthcheckDate,
    healthcheckDescription, 
    setHealthcheckDescription,
    healthCheckAdded, 
    callAddHealthcheck,
    setCallAddHealthcheck
  } = useAddHealthcheck(
    user, 
    () => {
      enqueueSnackbar('Pregled je uspešno dodat', { 
        variant: 'success',
        autoHideDuration: 2000
      })
      closeDialog()
    }, 
    (error) => {
       enqueueSnackbar(`${error}`, { 
        variant: 'error',
        autoHideDuration: 2000
      })
    }
  )
  const [healthchecks, setHealthchecks] = useState(null)
  const {
    healthchecksAPI, 
    isLoading,
    setIsLoading,
    page,
    setPage,
    shouldFetchHealthchecks,
    setShouldFetchHealthchecks
    } = useFetchHealthcheck({
    healthCheckAdded,
    user,
    onSuccess: (healthchecksRes) => {
      setHealthchecks(healthchecksRes)
    },
    onError: () => {}
  })
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  // const [healthchecks, setHealthchecks] = useState(null)
  // const [isLoading, setIsLoading] = useState(true)
  // const [rating, setRating] = useState(0)
  // const [noOfRatings, setNoOfRatings] = useState(0)
  // const [allRatings, setAllRatings] = useState(0)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // const [selectedDoctor, setSelectedDoctor] = useState(null)
  // const [selectedHospital, setSelectedHospital] = useState(null)

  const [doctorOptions, setDoctorOptions] = useState([])
  const [hospitalOptions, setHospitalOptions] = useState([])
  const [searchFullName, setSearchFullName] = useState('')
  const [searchSpecialization, setSearchSpecialization] = useState('')

  // const [healthcheckDate, setHealthcheckDate] = useState(null)

  // const [healthcheckDescription, setHealthcheckDescription] = useState('')



  const resetModalState = () => {
    setSelectedDoctor(null)
    setSelectedHospital(null)
    setHealthcheckDate(null)
    setHealthcheckDescription('')
    setRating(0)
    setDoctorRating(0)
    setNoOfRatings(0)
    setAllRatings(0)
  }
  
  const openDialog = _ => {
    resetModalState()
    setIsDialogOpen(true)
  }

  const closeDialog = _ => {
    resetModalState()
    setIsDialogOpen(false)
  }

  const handleSetRating = (value) => {
    const currentNoOfRatings = (selectedDoctor && Number(selectedDoctor?.noOfRatings)) || 0
    const currentAllRatings = (selectedDoctor && Number(selectedDoctor?.allRatings)) || 0
    setDoctorRating(value)
    setRating(value)
    setNoOfRatings(currentNoOfRatings + 1)
    setAllRatings(Number(value) + currentAllRatings)
  }

  const handleSearchHospitals = (searchParam, wait = DEFAULT_DEBOUNCE_WAIT) => {
    debounce(async _ => {
      try {
        const hospitals = await getAllHospitals(searchParam = {})
        setHospitalOptions(hospitals?.data)
      } catch (error) {
        
      }
    }, wait)()
  }

  const handleSearchDoctors = (searchParam, wait = DEFAULT_DEBOUNCE_WAIT) => {
    debounce(async _ => {
      try {
        const doctors = await searchDoctors(searchParam)
        setDoctorOptions(doctors?.data)
      } catch (error) {
        
      }
    }, wait)()
  }

  const goSearch = async () => {
    setIsLoading(true)
    try {
      const hcRes = await searchUserChecks(user?.user?.id, {
        fullName: searchFullName || undefined,
        specialization: searchSpecialization || undefined,
        pageNo: page === 1 ? 0 : page - 1
      })
      setHealthchecks(hcRes)
      setIsLoading(false)
      closeDialog()
    } catch (error) {
      setIsLoading(false)
      closeDialog()
    }
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
        title='Novi pregled'
        onCancelLabel="Odustani"
        onDoneLabel="Dodaj"
        onClose={closeDialog}
        onCancel={closeDialog}
        disabledDone={notValidAddHealthcheck}
        onDone={_ => setCallAddHealthcheck(!callAddHealthcheck)}
        content={<React.Fragment>
          <DialogContentText>
            Pretražite postojeću bazu zdravstvenih institucija po nazivu:
          </DialogContentText>
          <Autocomplete
            id="hospital"
            freeSolo
            getOptionLabel={v => v.name}
            onInputChange={(event, value) => handleSearchHospitals({name: value})}
            onHighlightChange={(event, option) => setSelectedHospital(option)}
            options={hospitalOptions}
            renderInput={(params) => (
              <TextField {...params} 
                label="Bolnica, Dom zdravlja" 
                margin="normal" 
                variant="outlined"
              />
            )} 
          />
          <br />
          <DialogContentText>
            Pretražite postojeću bazu lekara ili dodajte novog:
          </DialogContentText>
          <Autocomplete
            id="doctor"
            freeSolo
            getOptionLabel={v => displayName(v)}
            onInputChange={(event, value) => handleSearchDoctors({fullName: value})}
            onHighlightChange={(event, option) => setSelectedDoctor(option)}
            options={doctorOptions}
            renderInput={(params) => (
              <TextField {...params} label="Lekar" margin="normal" variant="outlined" />
            )}
           />
           <br />
          <DialogContentText>
            Unesite utiske sa pregleda:
          </DialogContentText>
           <TextareaAutosize 
            aria-label="Beleške" 
            placeholder="Beleške..." 
            value={healthcheckDescription} 
            onChange={e => setHealthcheckDescription(e.target.value)} 
          />
          <br />
          <br />
          <DialogContentText>
            Ocenite lekara:
          </DialogContentText>
          <Rating 
            value={rating} 
            onChangeRating={(newRating) => {
              handleSetRating(newRating)
            }} 
          />
          <br />
          <br />
          <DialogContentText>
            Unesite datum pregleda.
          </DialogContentText>
          <DatePicker value={healthcheckDate} onChange={setHealthcheckDate} />
        </React.Fragment>}
      />
      <CenteredBox>
        <h1 className={classes.header}>Moji pregledi</h1>
        <AddCircle 
          className={classes.headerAdd} 
          onClick={_ => openDialog()} 
        />
      </CenteredBox>
      <CenteredBox>
        <TextField 
          size="small"
          id="outlined-basic" 
          label="Lekar" 
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
          onClick={_ => {
            setSearchFullName('')
            setSearchSpecialization('')
            setShouldFetchHealthchecks(!shouldFetchHealthchecks)
          }} 
          color="secondary" 
          disabled={isLoading}
        >
          SVI
        </Button>
       </CenteredBox>
       <br />
       <br />

      {healthchecks && healthchecks.data.data.length > 0 ? (
        <HealthCheckTable 
          healthchecks={healthchecks} 
          page={page} 
          setPage={setPage} 
        />
      ) : null}
    </div>
  )
}

export default Healthchecks
