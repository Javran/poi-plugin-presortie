import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { store } from 'views/create-store'

import {
  emptyPState,
  updateSortieHistory,
} from '../p-state'

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

  if (action.type === '@poi-plugin-presortie@MapIdChange') {
    const { sortieHistory } = state
    const { mapId } = action
    const newSortieHistory = updateSortieHistory(sortieHistory,mapId)
    if (newSortieHistory !== sortieHistory) {
      return {
        ...state,
        sortieHistory: newSortieHistory,
      }
    } else {
      return state
    }
  }

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

  return state
}

const actionCreator = {
  onInit: pState => ({
    type: '@poi-plugin-presortie@Init',
    pState,
  }),
  // note that mapId must be a valid mapId
  onMapIdChange: mapId => ({
    type: '@poi-plugin-presortie@MapIdChange',
    mapId}),
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
