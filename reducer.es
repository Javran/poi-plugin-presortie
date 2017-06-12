import { _ } from 'lodash'

import {
  emptyPState,
  updateSortieHistory,
} from './p-state'

const initState = {
  ...emptyPState,
}

const reducer = (state = initState, action) => {
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
  return state
}

const mapDispatchToProps = dispatch => ({
  // note that mapId must be a valid mapId
  onMapIdChange: mapId => dispatch({
    type: '@poi-plugin-presortie@MapIdChange',
    mapId}),
})

export {
  reducer,
  mapDispatchToProps,
}
