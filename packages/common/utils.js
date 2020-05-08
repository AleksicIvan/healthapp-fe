import forEach from 'lodash/forEach'
import keys from 'lodash/keys'
import { contains } from 'ramda'

import routes from './api'

export function matches(regex, input, withMeta) {
  const matches = []
  let match = regex.exec(input)
  while (match != null) {
    matches.push(withMeta ? match : match[1])
    match = regex.exec(input)
  }
  return matches
}

export const getRouteParams = (route) => matches(/{([^}]*)}/g, route)

export const generateRoute = (route, params = {}) => {
  const neededParams = getRouteParams(route)
  const providedParams = keys(params)
  const missing = neededParams.filter((p) => !contains(p, providedParams))

  if (missing.length > 0) {
    throw new Error(`Missing ${route} parameters: ` + missing.join(', '))
  }

  let generated = route
  forEach(params, (value, param) => {
    let regexp = new RegExp(`{${param}}`, 'g')
    generated = generated.replace(regexp, value)
  })
  return generated
}

export const routeByName = (routeName, params = {}, auth = false) => {
  if (routeName in routes) {
    return generateRoute(routes[routeName], params)
  } else {
    throw new Error(`Route ${routeName} not found!`)
  }
}

export const displayName = (entity) => {
  return entity?.firstName && entity?.lastName
    ? `${entity.firstName} ${entity.lastName}`
    : entity?.firstName
    ? `${entity.firstName}`
    : entity?.lastName
    ? `${entity.lastName}`
    : 'No name provided'
}

export const displayAddress = (address) => {
  return address?.city && address?.street
    ? `${address.street}, ${address.city}`
    : address?.city
    ? `${address.city}`
    : address?.street
    ? `${address.street}`
    : 'No address provided'
}
