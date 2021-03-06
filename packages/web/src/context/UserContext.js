import React, { useEffect } from 'react'

import { getUserFromStorage } from '@healthapp/common/services/storage'
import useAuthReducer from '@healthapp/common/hooks/useAuthReducer'


export const UserContext = React.createContext(null)

const UserContextProvider = (props) => {
const [state, dispatch] = useAuthReducer();
  
  useEffect(_ => {
    dispatch({type: 'GET_USER_REQUEST'})
    getUserFromStorage(localStorage)
    .then(user => {
      if (user) {
        dispatch({type: 'GET_USER_SUCCESS', payload: user})
      } else {
        dispatch({type: 'GET_USER_SUCCESS', payload: null})
      }
    })
  }, [dispatch])

  return (
    <UserContext.Provider 
      value={{ 
        ...state,
        dispatch
      }}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
