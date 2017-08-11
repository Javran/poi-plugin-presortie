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
  // TODO: onXXX cleanup
  onInit: pState => ({
    type: '@poi-plugin-presortie@Init',
    pState,
  }),
  onDynMapIdChange: dynMapId => ({
    type: '@poi-plugin-presortie@DynMapIdChange',
    dynMapId,
  }),
  onModifyMapExtras: modifier => ({
    type: '@poi-plugin-presortie@ModifyMapExtras',
    modifier,
  }),
  onFleetIdChange: fleetId => ({
    type: '@poi-plugin-presortie@FleetIdChange',
    fleetId,
  }),
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
