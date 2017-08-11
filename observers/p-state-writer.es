import { observer } from 'redux-observers'
import shallowEqual from 'shallowequal'

import {
  extSelector,
} from '../selectors'

/* import {
 *   stateToPState,
 * } from '../store'
 *
 */
import {
  savePState,
} from '../p-state'

// TODO
const stateToPState = () => undefined

const pStateWriter = observer(
  state => stateToPState(extSelector(state)),
  (_dispatch, curPState, prevPState) => {
    if (curPState === prevPState ||
        // current state is not initialized
        curPState === null ||
        // transition from an uninitialized state
        prevPState === null)
      return
    if (!shallowEqual(curPState,prevPState)) {
      setTimeout(() => savePState(curPState))
    }
  })

export { pStateWriter }
