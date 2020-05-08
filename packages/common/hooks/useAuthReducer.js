import React, { useReducer } from 'react'

const initialState = {user: null, isAuthenticated: false, isAuthenticating: true}

function reducer(state, action) {
  switch (action.type) {
    case 'GET_USER_REQUEST':
      console.log('gur')
      return {user: null, isAuthenticated: false, isAuthenticating: true}
    case 'GET_USER_SUCCESS':
      console.log('gus: ', action.payload)
      return {user: action.payload, isAuthenticated: action.payload ? true : false, isAuthenticating: false}
    case 'GET_USER_ERROR':
      return initialState
    case 'REMOVE_USER':
      return {user: null, isAuthenticated: false, isAuthenticating: false}
    default:
      return initialState
  }
}

export default () => {
  const [authState, authDispatch] = useReducer(reducer, initialState)

  return [authState, authDispatch]
}