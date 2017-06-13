import { PropTypes } from 'prop-types'

const _ = require('lodash')

// PTyp is just short for PropTypes.
// In addition, this allows us to collect validation logic
// in one place

const allRequired = shapeObj => {
  const ret = {}
  Object.keys(shapeObj).map(k => {
    const original = shapeObj[k]
    ret[k] = typeof original.isRequired !== 'undefined'
      ? original.isRequired
      : PropTypes.oneOfType([original]).isRequired
  })
  return ret
}

const isValue = expectedValue =>
  PropTypes.oneOf([expectedValue])

const MapInfo = PropTypes.shape(allRequired({
  id: PropTypes.number,
  name: PropTypes.string,
  world: PropTypes.number,
  area: PropTypes.number,
}))

const MapId = PropTypes.number

const DynMapId = PropTypes.oneOfType([
  isValue('last'),
  MapId])

const LinkInfo = PropTypes.shape({
  ...allRequired({
    name: PropTypes.string,
    link: PropTypes.string,
  }),
  // (optional) only present on custom links
  onModifyLink: PropTypes.func,
})

const Note = PropTypes.shape(allRequired({
  id: PropTypes.number,
  content: PropTypes.string,
}))

const CheckMethod = PropTypes.shape(allRequired({
  type: PropTypes.oneOf(['le','eq','ge']),
  value: PropTypes.number,
}))

const CheckTarget = PropTypes.oneOf(['fs','all'])

// Checkers whoes "id" fields could be missing
const PartialChecker = {
  AllSlots: PropTypes.shape(allRequired({
    type: isValue('all-slots'),
    method: CheckMethod,
    ignoreExtra: PropTypes.bool,
  })),
}

const PTyp = {
  ...PropTypes,
  allRequired,
  isValue,

  MapInfo,
  MapId,
  DynMapId,
  LinkInfo,

  Note,

  CheckTarget,
  CheckMethod,

  PartialChecker,
}

export { PTyp }
