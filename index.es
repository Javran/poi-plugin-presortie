import { connect } from 'react-redux'
import { presortieMainUISelector } from './selectors'
import { PresortieMain } from './ui'
import { reducer, mapDispatchToProps } from './reducer'

const reactClass = connect(
  presortieMainUISelector,
  mapDispatchToProps)(PresortieMain)

export {
  reactClass,
  reducer,
}
