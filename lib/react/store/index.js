import merge from 'lodash.merge'
import {combineReducers} from 'redux'
import {routerReducer as routing} from 'react-router-redux'

let configureStore = null
if (process.env.NODE_ENV === 'production') {
  configureStore = require('./store.production')
} else {
  configureStore = require('./store.development')
}

export default function createStore (reducers) {
  const store = safeParse(process.env.STORE)
  const state = safeParse(window.localStorage ? window.localStorage.getItem('state') : {})
  return configureStore(
    merge(store, state),
    combineReducers({routing, ...reducers})
  )
}

function safeParse (str) {
  try {
    return JSON.parse(str) || {}
  } catch (e) {
    return {}
  }
}
