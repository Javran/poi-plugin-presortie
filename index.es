import { connect } from 'react-redux'
import { presortieMainUISelector } from './selectors'
import { PresortieMain } from './ui'
import { reducer, mapDispatchToProps } from './reducer'
import { globalSubscribe, globalUnsubscribe } from './observers'

const reactClass = connect(
  presortieMainUISelector,
  mapDispatchToProps)(PresortieMain)

const switchPluginPath = [
  {
    path: "/kcsapi/api_get_member/mapinfo",
    valid: () => true,
  },
]

const pluginDidLoad = () => {
  globalSubscribe()
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
