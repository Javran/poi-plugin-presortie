/*
   PState is short for persistent state.

   - for avoiding cyclic imports, there is no use of store and selectors

 */
import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const $dataVersion = 'initial'

const getPStateFilePath = () => {
  const { APPDATA_PATH } = window
  const configPath = join(APPDATA_PATH,'presortie')
  ensureDirSync(configPath)
  return join(configPath,'p-state.json')
}

const savePState = pState => {
  try {
    const pStateWithVer = {
      ...pState,
      $dataVersion,
    }
    writeJsonSync(getPStateFilePath(),pStateWithVer)
  } catch (err) {
    console.error('Error while writing to p-state file', err)
  }
}

const updatePState = (oldPState, forceSave = false) => {
  /*
     newPState is supposed to be
     going through updating logic from version to version
     and being re-bound constantly
   */
  let newPState = oldPState

  if (newPState.$dataVersion === $dataVersion) {
    // remove "$dataVersion" as it's not needed at runtime
    const {$dataVersion: _ignored, ...pState} = newPState
    if (forceSave) {
      setTimeout(() => savePState(newPState))
    }
    return pState
  }

  /*
     version-to-version p-state updating logics
   */
  if (!('$dataVersion' in newPState)) {
    const {sortieHistory, dynMapId, mapExtras} = newPState
    const selectedMap =
      dynMapId === 'last' ? {type: 'last'} : {type: 'id', mapId: dynMapId}
    const persist = {
      fleetId: 1,
      selectedMap,
      mapMemos: mapExtras,
    }
    newPState = {
      sortieHistory,
      persist,
      $dataVersion: 'initial',
    }
  }

  if (newPState.$dataVersion === $dataVersion) {
    // feeding back updated p-state, but this time it'll be saved.
    return updatePState(newPState,true)
  } else {
    throw new Error('Failed to update p-state file')
  }
}

const loadPState = () => {
  try {
    return updatePState(readJsonSync(getPStateFilePath()))
  } catch (err) {
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while reading p-state file', err)
    }
    return null
  }
}

/*
   get pState from extState.
   returns null if extState is not ready for saving.
 */
const extStateToPState = extState => {
  const {sortieHistory, persist} = extState
  /*
     'sortieHistory' is ready as long as 'persist' part is,
     as 'persist' is always initialized later than `sortieHistory`
   */
  const isReady = persist.ready
  return isReady ? {sortieHistory, persist} : null
}

/* apply a p-state to current extension state through dispatching actions

   - pState === null, which indicates a initial one, or failed loading
     is also accepted
 */
const applyPState = (pStateOrNull, withBoundActionCreator) =>
  withBoundActionCreator(bac => {
    if (pStateOrNull === null) {
      bac.sortieHistoryMergeOld([])
      /*
         expicitly passing undefined to indicate the reducer
         that initial state should be used instead
       */
      bac.persistReady(undefined)
    } else {
      const {sortieHistory, persist} = pStateOrNull
      bac.sortieHistoryMergeOld(sortieHistory)
      bac.persistReady(persist)
    }
  })

export {
  loadPState,
  savePState,

  extStateToPState,
  applyPState,
}
