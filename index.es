import { PresortieMain as reactClass } from './ui'
import { Settings as settingsClass } from './ui/settings'
import { reducer, withBoundActionCreator } from './store'
import { globalSubscribe, globalUnsubscribe } from './observers'
import { loadPState, applyPState } from './p-state'

/*

   TODO:

   - i18n
   - plan checkers for combined fleets
   - perhaps arrange history in a more consistent way?

 */

const switchPluginPath = [
  {
    path: "/kcsapi/api_get_member/mapinfo",
    valid: () => true,
  },
]

const pluginDidLoad = () => {
  globalSubscribe()
  setTimeout(() => {
    const pState = loadPState()
    applyPState(pState, withBoundActionCreator)
  })
}

const pluginWillUnload = () => {
  globalUnsubscribe()
}

export {
  reactClass,
  settingsClass,
  switchPluginPath,
  reducer,
  pluginDidLoad,
  pluginWillUnload,
}
