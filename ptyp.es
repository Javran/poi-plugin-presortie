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

const PTyp = {
  ...PropTypes,
  allRequired,
  isValue,

  MapInfo,
  MapId,
  DynMapId,
}

export { PTyp }
