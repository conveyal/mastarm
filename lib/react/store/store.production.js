import {browserHistory} from 'react-router'
import {routerMiddleware} from 'react-router-redux'
import {applyMiddleware, createStore} from 'redux'

import {middleware as fetch} from '../fetch'
import multi from './multi'
import promise from './promise'

export default function configureStore (initialState, rootReducer) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      routerMiddleware(browserHistory),
      fetch,
      multi,
      promise
    )
  )
}
