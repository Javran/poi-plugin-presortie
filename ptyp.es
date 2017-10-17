import { PropTypes } from 'prop-types'

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
  area: PropTypes.number,
  num: PropTypes.number,
}))

const MapId = PropTypes.number

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
  type: PropTypes.oneOf(['lt','le','eq','ge','gt']),
  value: PropTypes.number,
}))

const CheckTarget = PropTypes.oneOf(['fs','all'])

// Checkers whoes "id" fields could be missing
const PartialChecker = {
  AllSlotsEmpty: PropTypes.shape(allRequired({
    method: CheckMethod,
    ignoreExtra: PropTypes.bool,
    ignoreUnlocked: PropTypes.bool,
  })),
}

const ShipInfo = PropTypes.shape(allRequired({
  level: PropTypes.number,
  name: PropTypes.string,
  rosterId: PropTypes.number,
}))

const FleetInfo = PropTypes.shape(allRequired({
  flagship: ShipInfo,
  id: PropTypes.number,
  name: PropTypes.string,
}))

const PTyp = {
  ...PropTypes,
  allRequired,
  isValue,

  MapInfo,
  MapId,
  LinkInfo,

  Note,

  CheckTarget,
  CheckMethod,

  PartialChecker,

  ShipInfo,
  FleetInfo,
}

export { PTyp }
