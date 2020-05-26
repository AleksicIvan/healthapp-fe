import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import debounce from 'lodash/debounce'
import { useSnackbar } from 'notistack'

import { makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import { DatePicker } from '@material-ui/pickers'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'

import CenteredBox from './CenteredBox'
import FileUpload from './FileUpload'
import Rating from './Rating'

import { getAllHospitals } from '@healthapp/common/services/hospitals'
import { searchDoctors, updateDoctor } from '@healthapp/common/services/doctors'
import { updateCheck, deleteHealthcheck } from '@healthapp/common/services/healthchecks'
import { deleteReport } from '@healthapp/common/services/reports'

import { displayName } from '@healthapp/common/utils'
import useGetHealthcheck from '@healthapp/common/hooks/useGetHealthcheck'
import { UserContext } from '../context/UserContext'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 400
  },
  ctas: {
    float: "right"
  }
})

const Report = (props) => {
  return (
    <div>
      <Link 
        color="primary"
        target="_blank"
        rel="noopener"
        href={props.s3FileUrl}>
        {props.s3FileUrl}
      </Link>
      <Button
        disabled={props.isLoadingHealthcheck || props.isUploadingReport}
        onClick={_ => {
          let reports = props.healthcheck?.reports.filter(r => r.id !== props.id)
          const data = {
          ...props.healthcheck,
            user: {
              id: props.user?.user?.id
            },
            reports
          }
          deleteReport(props.id)
            .then(_ => {
              props.updateHealthCheck(data, 'Izveštaj je uspešno obrisan')
            })
        }} 
        color="secondary" 
      >
        OBRIŠI
      </Button>
    </div>
  )
}

const DEFAULT_DEBOUNCE_WAIT = 1000

const HealthcheckDetails = (props) => {
  const history = useHistory()
  const user = useContext(UserContext)
  const classes = useStyles()
  const { healthCheckId } = useParams()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [isUploadingReport, setIsUploadingReport] = useState(false)
  const [isUpdatingHealthcheck, setIsUpdatingHealthcheck] = useState(false)
  const [healthcheck, setHealthcheck] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [healthcheckDescription, setHealthcheckDescription] = useState('')
  const [rating, setRating] = useState(0)
  const [healthcheckDate, setHealthcheckDate] = useState(null)
  const {
    isLoadingHealthcheck,
    callGetCheck,
    setCallGetCheck
  } = useGetHealthcheck(
    user?.user?.id,
    healthCheckId, 
    healthcheck => {
      setHealthcheck(healthcheck)
      setSelectedDoctor(healthcheck?.doctor)
      setSelectedHospital(healthcheck?.hospital)
      setHealthcheckDescription(healthcheck?.description)
      setHealthcheckDate(healthcheck?.createdAt)
      setRating(healthcheck?.doctorRating)
    },
    () => {}
  )
  const [doctorOptions, setDoctorOptions] = useState([])
  const [hospitalOptions, setHospitalOptions] = useState([])



  const handlePrepareDataForEdit = (value = healthcheck?.doctorRating)  => {
    let data = {
      ...healthcheck,
      doctorRating: value,
      user: {
        id: user.user?.id
      },
      doctor: {...selectedDoctor},
      hospital: {...selectedHospital},
      description: healthcheckDescription,
      createdAt: healthcheckDate
    }
    updateHealthCheck(data, 'Pregled je uspešno ažuriran')
  }

  const handleSetRating = async (value) => {
    const currentNoOfRatings = (selectedDoctor && Number(selectedDoctor?.noOfRatings)) || 0
    const currentAllRatings = (selectedDoctor && Number(selectedDoctor?.allRatings)) || 0
    setRating(value)
    try {
      setIsUpdatingHealthcheck(true)
      await updateDoctor({
        ...selectedDoctor,
        noOfRatings: currentNoOfRatings + 1,
        allRatings: Number(value) + currentAllRatings
      })
      enqueueSnackbar('Lekar je uspešno ocenjen', { 
        variant: 'success',
        autoHideDuration: 2000
      })
      handlePrepareDataForEdit(value)
      setIsUpdatingHealthcheck(false)
    } catch (e) {
      setIsUpdatingHealthcheck(false)
      enqueueSnackbar(`${e}`, { 
        variant: 'error',
        autoHideDuration: 2000
      })
    }    
  }


  const handleHealthcheckDescription = (value) => {
      setHealthcheckDescription(value)
  }

  const handleDeleteHealthcheck = async () => {
      await deleteHealthcheck(healthcheck?.id)
      history.replace('/pregledi')
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

  const handleSearchDoctors = (searchParam = {}, wait = DEFAULT_DEBOUNCE_WAIT) => {
    debounce(async _ => {
      try {
        const doctors = await searchDoctors(searchParam)
        setDoctorOptions(doctors?.data)
      } catch (error) {
        
      }
    }, wait)()
  }

  const updateHealthCheck = async (data, growlMessage) => {
    setIsUpdatingHealthcheck(true)
    setIsUploadingReport(true)
    try {
      const newHc = await updateCheck(data)
      enqueueSnackbar(growlMessage, { 
        variant: 'success',
        autoHideDuration: 2000
      })
      setHealthcheck(newHc?.data)
      setSelectedDoctor(newHc?.data?.doctor)
      setSelectedHospital(newHc?.data?.hospital)
      setHealthcheckDescription(newHc?.data?.description)
      setHealthcheckDate(newHc?.data?.createdAt)
      setIsUploadingReport(false)
      setIsUpdatingHealthcheck(false)
    } catch (e) {
      setIsUploadingReport(false)
      setIsUpdatingHealthcheck(false)
      enqueueSnackbar(`${e}`, { 
        variant: 'error',
        autoHideDuration: 2000
      })
    }
  }

  useEffect((_) => {
    setCallGetCheck && setCallGetCheck(!callGetCheck)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [healthCheckId, user.user]) // with pagination implemented arr will have page el

  if (isLoadingHealthcheck) {
    return <h1>Loading...</h1>
  }

  const disabled = isUpdatingHealthcheck || isLoadingHealthcheck || isUploadingReport

  return (
    <Card className={classes.root}>
      <CardContent>
        {healthcheck && (
          <div>
            <CenteredBox>
              <Typography variant="h4">Pregled</Typography>
            </CenteredBox>
            <br />
            <div>
              <Typography variant="h5">Datum:{' '}</Typography>
              <div>
                <DatePicker disabled={disabled} value={healthcheckDate} onChange={setHealthcheckDate} />
              </div>
            </div>
            <br />
            <Typography variant="h5">Opis:{' '}</Typography>
            <TextareaAutosize
              disabled={disabled} 
              aria-label="Beleške" 
              placeholder="Beleške..." 
              value={healthcheckDescription} 
              onChange={e => handleHealthcheckDescription(e.target.value)} 
            />
            <br />
            <br />
            <div>
            <Typography variant="h5">Lekar:{' '}</Typography>
            <Autocomplete
              disabled={disabled}
              id="doctor"
              value={selectedDoctor}
              autoSelect
              freeSolo
              getOptionLabel={v => displayName(v)}
              onInputChange={(event, value) => handleSearchDoctors({fullName: value})}
              onHighlightChange={(event, option) => setSelectedDoctor(option)}
              options={doctorOptions}
              renderInput={(params) => (
                <TextField {...params} label="Lekar" margin="normal" variant="outlined" />
              )}
            />
            </div>
            <br />
            <div>
            <Typography variant="h5">Ocenite lekara:{' '}</Typography>
            <Rating 
              disabled={disabled}
              value={rating} 
              onChangeRating={(newRating) => {
                handleSetRating(newRating)
              }} 
            />
            </div>
            <div>
              <Typography variant="h5">Zdravstvena ustanova:{' '}</Typography>
              <Autocomplete
                disabled={disabled}
                id="hospital"
                value={selectedHospital}
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
            </div>
            <br />
            <div>
              <Typography component="h4">Izveštaji:{' '}</Typography>
              <FileUpload
                disabled={disabled} 
                onUpload={newReportData => {
                  const reports = [
                    ...healthcheck?.reports,
                    {...newReportData?.data}
                  ]
                  updateHealthCheck({
                    ...healthcheck,
                    user: {
                      id: user?.user?.id
                    },
                    reports
                  }, 'Izveštaj je uspešno dodat')
                }}
                userId={user?.user?.id}
                healthCheck={healthcheck} />
                {healthcheck?.reports?.length > 0 && healthcheck.reports.map((r) => (
                  <Report 
                    key={r.id} 
                    {...r} 
                    user={user} 
                    healthcheck={healthcheck} 
                    isLoadingHealthcheck={isLoadingHealthcheck}
                    isUploadingReport={isUploadingReport}
                    updateHealthCheck={updateHealthCheck} 
                  />
                ))}
            </div>
            <div className={classes.ctas}>
              <Button 
                disabled={disabled}
                variant="contained"
                onClick={_ => handlePrepareDataForEdit()} 
              >
                IZMENI
              </Button>&nbsp;&nbsp;
              <Button 
                disabled={disabled}
                variant="contained"
                onClick={_ => handleDeleteHealthcheck()} 
                color="secondary"
              >
                OBRIŠI
              </Button>
            </div>
            <br />
            <br />
          </div>
        )}
       </CardContent>
    </Card>
  )
}

export default HealthcheckDetails
