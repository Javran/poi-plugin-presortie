import { _ } from 'lodash'

import {
  initConfig,
} from './config'

const reducer = (state = initConfig, action) => {
  if (action.type === '@poi-plugin-presortie@MapIdChange') {
    const { sortieHistory } = state
    const { mapId } = action
    if (sortieHistory.length === 0 ||
        sortieHistory[0] !== mapId) {
      return {
        ...state,
        // keep up to 5 history contents
        sortieHistory: _.take(
          [mapId, ...sortieHistory.filter(x => x !== mapId)],
          5),
      }
    } else {
      return state
    }
  }
  return state
}

const mapDispatchToProps = dispatch => ({
  // note that mapId must be an integer.
  onMapIdChange: mapId => dispatch({
    type: '@poi-plugin-presortie@MapIdChange',
    mapId}),
})

export {
  reducer,
  mapDispatchToProps,
}
