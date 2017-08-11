import { observer } from 'redux-observers'
import shallowEqual from 'shallowequal'

import {
  extSelector,
} from '../selectors'

import {
  savePState,
  extStateToPState,
} from '../p-state'

const pStateWriter = observer(
  state => extStateToPState(extSelector(state)),
  (_dispatch, curPState, prevPState) => {
    if (
      /*
         ensure that it's a change from ready state to ready state
         (so we don't save the initial loaded state)
       */
      curPState && prevPState &&
      !shallowEqual(curPState, prevPState)
    ) {
      setTimeout(() => savePState(curPState))
    }
  }
)

export { pStateWriter }
