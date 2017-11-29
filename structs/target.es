import _ from 'lodash'

class Target {
  // TODO: more to come, full list:
  // fleet / combined / lbas
  /*
     NOTE: lbas needs to be determined dynamically?

     - every world would have a separated land base
     - I guess the best we can do a way would be to determine it base on memo focus
     - what to do with "general" focus?
     - or should we have a separated checker for lbas stuff?

   */
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

  /*
     returns the fleetId of a Target if the structure in question
     is indeed a fleet, (TODO) otherwise null is returned
   */
  static extractFleetId = Target.destruct({
    fleet: x => x,
  })

  static toString = Target.destruct({
    fleet: fleetId => `Fleet #${fleetId}`,
  })
}

export { Target }
