import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const { APPDATA_PATH } = window

const getEmptyConfig = () => ({
  // a list of mapIds
  sortieHistory: [],
})

const getConfigFilePath = () => {
  const configPath = join(APPDATA_PATH,'presortie')
  ensureDirSync(configPath)
  return join(configPath,'config.json')
}

const loadConfig = () => {
  try {
    return readJsonSync(getConfigFilePath())
  } catch (err) {
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while reading config file', err)
    }
    return getEmptyConfig()
  }
}

const saveConfig = config => {
  try {
    writeJsonSync(getConfigFilePath(),config)
  } catch (err) {
    console.error('Error while writing to config file', err)
  }
}

const initConfig = loadConfig()

export {
  initConfig,
  saveConfig,
}
