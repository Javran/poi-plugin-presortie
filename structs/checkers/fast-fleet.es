import _ from 'lodash'
import {
  fleetShipsDataSelectorFactory,
} from 'views/utils/selectors'
import { getFleetSpeed } from 'views/utils/game-utils'

import {
  shipTextSelectorFactory,
} from './selectors'

import { Target } from '../target'

const isFast = speed => speed >= 10

class FastFleet {
  static type = 'fast-fleet'

  static defValue = {
  }

  static title = "Fast Fleet"

  static isValidObj = () => true

  static isValidTarget = target =>
    ['fleet', 'combined'].includes(Target.getType(target))

  static describe = () => "Require a fast fleet"

  static prepare = obj => checkerContext => {
    const listProblemsForFleet = fleetId => {
      const fleetInd = fleetId-1
      let shipsData = fleetShipsDataSelectorFactory(fleetInd)(checkerContext)
      if (!shipsData)
        shipsData = []
      const fleetSpeed = getFleetSpeed(shipsData)
      if (isFast(fleetSpeed) || shipsData.length === 0 /* vacuously true */)
        return []
      return shipsData
        .filter(([ship]) =>
          ship && typeof ship.api_soku === 'number' && !isFast(ship.api_soku))
        .map(([ship]) => `${shipTextSelectorFactory(ship.api_id)(checkerContext)} is not fast`)
    }

    const {target} = obj

    return Target.destruct({
      fleet: fleetId => listProblemsForFleet(fleetId),
      combined: () =>
        _.flatMap([1,2], listProblemsForFleet),
    })(target)
  }
}

export {
  FastFleet,
}
