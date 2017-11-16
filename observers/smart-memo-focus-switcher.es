import _ from 'lodash'
import { observer } from 'redux-observers'
import { createStructuredSelector } from 'reselect'
import { sortieMapIdSelector } from 'views/utils/selectors'

import {
  persistReadySelector,
  userPreferredMemoFocusSelector,
  memoFocusSelector,
  smartMemoFocusSelector,
} from '../selectors'
import { withBoundActionCreator } from '../store'
import { MemoId } from '../structs'

// TODO: we might just need a "readySelector"

const smartMemoFocusSwitcher = observer(
  createStructuredSelector({
    mapId: state => {
      // TODO: factor out same part in sortieHistoryUpdater
      const mapIdRaw = sortieMapIdSelector(state)
      const parsed = Number(mapIdRaw)
      // all falsy values are turned into null
      return _.isInteger(parsed) ? parsed : null
    },
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
