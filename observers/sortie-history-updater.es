import { observer } from 'redux-observers'
import { sortieMapIdSelector } from 'views/utils/selectors'

import {
  withBoundActionCreator,
} from '../store'

const sortieHistoryUpdater = observer(
  state => {
    const mapIdRaw = sortieMapIdSelector(state)
    const parsed = parseInt(mapIdRaw,10)
    // all falsy values are turned into null
    return !parsed ? null : parsed
  },
  (dispatch, curMapId, prevMapId) => {
    // only observe sortie-changing events
    // where we are not returning to port (i.e. not null)
    if (curMapId !== prevMapId &&
        curMapId !== null) {
      withBoundActionCreator(
        bac => bac.sortieHistoryAdd(curMapId),
        dispatch
      )
    }
  })

export { sortieHistoryUpdater }
