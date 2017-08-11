import _ from 'lodash'
import { bindActionCreators, combineReducers } from 'redux'
import { store } from 'views/create-store'

import {
  emptyPState,
  updateSortieHistory,
} from '../p-state'

import {
  reducer as sortieHistoryReducer,
  actionCreator as sortieHistoryAC,
} from './sortie-history'

const initState = {
  ready: false,
  ...emptyPState,
  fleetId: 1,
}

// keep only parts needed to be persistent
const stateToPState = state => {
  const {
    ready,
    sortieHistory,
    dynMapId,
    mapExtras,
  } = state
  if (!ready)
    return null
  return {
    sortieHistory,
    dynMapId,
    mapExtras,
  }
}

const newReducer = combineReducers({sortieHistory: sortieHistoryReducer})

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-presortie@Init') {
    const { pState } = action
    return {
      ...state,
      ...pState,
      ready: true,
    }
  }

  if (!state.ready)
    return state

  if (action.type === '@poi-plugin-presortie@DynMapIdChange') {
    const { dynMapId } = action
    return {
      ...state,
      dynMapId,
    }
  }

  if (action.type === '@poi-plugin-presortie@ModifyMapExtras') {
    const { ready, mapExtras } = state
    if (!ready) {
      console.error('attempted to modify map extras while initializing')
      return state
    }
    const { modifier } = action
    return {
      ...state,
      mapExtras: modifier(mapExtras),
    }
  }

  if (action.type === '@poi-plugin-presortie@FleetIdChange') {
    const { fleetId } = action
    return {
      ...state,
      fleetId,
    }
  }

  {
    const {sortieHistory: sh, ...restState} = state
    return {
      ...newReducer({sortieHistory: sh}, action),
      ...restState,
    }
  }
}

const actionCreator = {
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

  stateToPState,
  initState,
}
