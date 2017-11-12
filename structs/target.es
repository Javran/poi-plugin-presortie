import _ from 'lodash'

class Target {
  // TODO: more to come, full list:
  // fleet / combined / lbas
  static destruct = ({fleet}) => target => {
    const fleetMatch = /^fleet-(\d+)$/.exec(target)
    if (fleetMatch) {
      const [_ignored, fleetIdStr] = fleetMatch
      const fleetId = Number(fleetIdStr)
      if (! _.isInteger(fleetId) || fleetId < 1 || fleetId > 4) {
        console.warn(`Fleet id might be invalid, got: ${fleetIdStr}`)
      }

      return fleet(fleetId)
    }
    console.error(`expecting a Target while getting ${target}`)
  }

  static toString = Target.destruct({
    fleet: fleetId => `Fleet #${fleetId}`,
  })
}

export { Target }
