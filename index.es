import { connect } from 'react-redux'
import { mapInfoArraySelector } from './selectors'
import { PresortieMain } from './ui'
import { reducer, mapDispatchToProps } from './reducer'

const reactClass = connect(
  mapInfoArraySelector,
  mapDispatchToProps)(PresortieMain)

export {
  reactClass,
  reducer,
}
