import _ from 'lodash'
import { bindActionCreators, combineReducers } from 'redux'
import { store } from 'views/create-store'

import {
  reducer as sortieHistory,
  actionCreator as sortieHistoryAC,
} from './sortie-history'

import {
  reducer as persist,
  actionCreator as persistAC,
} from './persist'

const reducer = combineReducers({sortieHistory, persist})

const initState = reducer(undefined, {type: '@@INIT'})

const actionCreator = {
  ...sortieHistoryAC,
  ...persistAC,
}

const mapDispatchToProps = _.memoize(dispatch =>
  bindActionCreators(actionCreator, dispatch))

const withBoundActionCreator = (func, dispatch=store.dispatch) =>
  func(mapDispatchToProps(dispatch))

const asyncBoundActionCreator = (func, dispatch=store.dispatch) =>
  dispatch(() => setTimeout(() =>
    withBoundActionCreator(func, dispatch)))

export {
  reducer,

  actionCreator,
  mapDispatchToProps,
  withBoundActionCreator,
  asyncBoundActionCreator,

  initState,
}
