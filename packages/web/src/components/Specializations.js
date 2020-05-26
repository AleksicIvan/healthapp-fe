import React, { useState, useEffect, useContext } from 'react'

import TextField from '@material-ui/core/TextField';

import Table from './Table'
import CenteredBox from './CenteredBox'
import Button from '@material-ui/core/Button'

import { 
  getSpecializations, 
  searchSpecializations 
} from '@healthapp/common/services/doctors'
import { UserContext } from '../context/UserContext'


const SpecializationsTable = (props) => {
  return <Table 
    colgroup={
      <colgroup>
        <col width="10%" />
        <col width="90%" />
      </colgroup>
    }
    paginationCount={props.specializations?.data?.meta?.count}
    paginationPage={props.page}
    paginationNumberOfPages={props.specializations?.data?.meta?.noPages}
    setPageHandler={props.setPage}
    headers={[
      "Id",
      "Naziv",
    ]}
    rows={props.specializations?.data?.data.map(spec => {
      return [
        spec?.id,
        spec?.name,
      ]
    })}
  />
}


const Specializations = (props) => {
  const [specializations, setSpecializations] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchName, setSearchName] = useState('')

  const user = useContext(UserContext)

  const getSpecializationsAPI = async () => {
    setIsLoading(true)
    try {
      const specializationsRes = await getSpecializations({pageNo: page === 1 ? 0 : page - 1})
      setSearchName('')
      setSpecializations(specializationsRes)
      setIsLoading(false)
    } catch (error) {
      setSpecializations(null)
      setIsLoading(false)
    }
  }

  const goSearch = async () => {
    setIsLoading(true)
    try {
      const specializationsRes = await searchSpecializations({
        name: searchName || undefined,
      })
      setSpecializations(specializationsRes)
      setIsLoading(false)
    } catch (error) {
      setSpecializations(null)
      setIsLoading(false)
    }
  }


  useEffect((_) => {
    getSpecializationsAPI()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, user.user, page])



  if (isLoading) {
    return <CenteredBox>
      <h1>Učitava se...</h1>
    </CenteredBox>
  }

  return (
    <div id="table-specializations">
      <CenteredBox>
        <h1>Sve specijalizacije</h1>
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
            setSearchName(e.target.value)
          }} 
          value={searchName} 
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
          onClick={_ => getSpecializationsAPI()} 
          color="secondary" 
          disabled={isLoading}
        >
          SVE
        </Button>
       </CenteredBox>
      <br />
      {specializations && specializations.data.data.length > 0 ? (
        <SpecializationsTable 
          specializations={specializations} 
          page={page} 
          setPage={setPage} 
        />
      ) : null}
    </div>
  )
}

export default Specializations
