import { PresortieMain as reactClass } from './ui'
import { reducer, withBoundActionCreator } from './store'
import { globalSubscribe, globalUnsubscribe } from './observers'
import { loadPState, applyPState } from './p-state'

/*

   TODO:

   - i18n
   - setting: smart last-sortie: when sortie map id = map id the plugin
     is focusing on, switch to last-sortie.
   - setting: re-arrange wiki links
   - plan checkers for combined fleets
   - limit history number

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
  switchPluginPath,
  reducer,
  pluginDidLoad,
  pluginWillUnload,
}
