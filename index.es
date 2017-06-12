import { connect } from 'react-redux'
import { mapInfoArraySelector } from './selectors'
import { PresortieMain } from './ui'

const reactClass = connect(mapInfoArraySelector)(PresortieMain)

export {
  reactClass,
}
