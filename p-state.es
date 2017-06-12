/*

   PState is short for persistent state

 */

import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'
import { _ } from 'lodash'

const emptyPState = {
  // a list of mapIds
  sortieHistory: [],
}

const getPStateFilePath = () => {
  const { APPDATA_PATH } = window
  const configPath = join(APPDATA_PATH,'presortie')
  ensureDirSync(configPath)
  return join(configPath,'p-state.json')
}

const loadPState = () => {
  try {
    return readJsonSync(getPStateFilePath())
  } catch (err) {
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while reading config file', err)
    }
    return emptyPState
  }
}

const savePState = config => {
  try {
    writeJsonSync(getPStateFilePath(),config)
  } catch (err) {
    console.error('Error while writing to config file', err)
  }
}

// newMapId: must be a valid mapId, "null" is not allowed here.
const updateSortieHistory = (sortieHistory, mapId) => {
  if (sortieHistory.length === 0 ||
      sortieHistory[0] !== mapId) {
    const newSH = [mapId, ...sortieHistory.filter(x => x !== mapId)]
    return _.take(newSH,5)
  } else {
    return sortieHistory
  }
}

export {
  emptyPState,
  loadPState,
  savePState,

  updateSortieHistory,
}
