import { _ } from 'lodash'

import {
  emptyPState,
  updateSortieHistory,
} from './p-state'

const initState = {
  ready: false,
  ...emptyPState,
}

// keep only parts needed to be persistent
const stateToPState = state => {
  const {
    ready,
    sortieHistory,
    dynMapId,
  } = state
  if (!ready)
    return null
  return {
    sortieHistory,
    dynMapId,
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

  return state
}

const mapDispatchToProps = dispatch => ({
  onInit: pState => dispatch({
    type: '@poi-plugin-presortie@Init',
    pState,
  }),
  // note that mapId must be a valid mapId
  onMapIdChange: mapId => dispatch({
    type: '@poi-plugin-presortie@MapIdChange',
    mapId}),
  onDynMapIdChange: dynMapId => dispatch({
    type: '@poi-plugin-presortie@DynMapIdChange',
    dynMapId,
  }),
})

export {
  reducer,
  mapDispatchToProps,
  stateToPState,
}
