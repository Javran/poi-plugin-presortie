import { observer } from 'redux-observers'
import { parsedSortieMapIdSelector } from '../selectors'

import {
  withBoundActionCreator,
} from '../store'

const sortieHistoryUpdater = observer(
  parsedSortieMapIdSelector,
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
