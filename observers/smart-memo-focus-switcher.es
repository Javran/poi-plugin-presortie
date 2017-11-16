import _ from 'lodash'
import { observer } from 'redux-observers'
import { createStructuredSelector } from 'reselect'

import {
  persistReadySelector,
  userPreferredMemoFocusSelector,
  memoFocusSelector,
  smartMemoFocusSelector,
  parsedSortieMapIdSelector,
} from '../selectors'
import { withBoundActionCreator } from '../store'
import { MemoId } from '../structs'

const smartMemoFocusSwitcher = observer(
  createStructuredSelector({
    mapId: parsedSortieMapIdSelector,
    ready: persistReadySelector,
    userPreferredMemoFocus: userPreferredMemoFocusSelector,
    memoFocus: memoFocusSelector,
    smartMemoFocus: smartMemoFocusSelector,
  }),
  (dispatch, cur, _prev) => {
    const {ready, smartMemoFocus, userPreferredMemoFocus, mapId} = cur
    // feature toggle
    if (!ready || !smartMemoFocus)
      return
    // destruct user setting
    if (userPreferredMemoFocus === 'last')
      return

    const uPrefMapId = MemoId.destruct({
      mapId: x => x,
      general: () => null,
    })(userPreferredMemoFocus)
    if (!uPrefMapId)
      return

    // check that player is in sortie
    if (!_.isInteger(mapId) || mapId <= 0)
      return

    if (uPrefMapId === mapId) {
      withBoundActionCreator(
        bac => bac.userPreferredMemoFocusChange('last'),
        dispatch
      )
    }
  }
)

export { smartMemoFocusSwitcher }
