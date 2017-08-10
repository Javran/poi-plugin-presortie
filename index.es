import { PresortieMain as reactClass } from './ui'
import { reducer, withBoundActionCreator } from './store'
import { globalSubscribe, globalUnsubscribe } from './observers'
import { loadPState } from './p-state'

const switchPluginPath = [
  {
    path: "/kcsapi/api_get_member/mapinfo",
    valid: () => true,
  },
]

const pluginDidLoad = () => {
  globalSubscribe()
  setTimeout(() =>
    withBoundActionCreator(bac =>
      bac.onInit(loadPState())
    )
  )
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
