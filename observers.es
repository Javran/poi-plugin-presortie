import { observer, observe } from 'redux-observers'
import shallowEqual from 'shallowequal'

import { store } from 'views/create-store'
import { sortieMapIdSelector } from 'views/utils/selectors'

import {
  extSelector,
} from './selectors'

import {
  mapDispatchToProps,
  stateToPState,
} from './reducer'

import {
  savePState,
} from './p-state'

const mapIdObserver = observer(
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
      mapDispatchToProps(dispatch).onMapIdChange(curMapId)
    }
  })

const pStateObserver = observer(
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

let unsubscribe = null

const globalSubscribe = () => {
  if (unsubscribe !== null) {
    console.warn('expecting "unsubscribe" to be null')
    if (typeof unsubscribe === 'function')
      unsubscribe()
    unsubscribe = null
  }

  unsubscribe = observe(
    store,
    [
      mapIdObserver,
      pStateObserver,
    ])
}

const globalUnsubscribe = () => {
  if (typeof unsubscribe !== 'function') {
    console.warn(`unsubscribe is not a function`)
  } else {
    unsubscribe()
    unsubscribe = null
  }
}

export {
  globalSubscribe,
  globalUnsubscribe,
}
