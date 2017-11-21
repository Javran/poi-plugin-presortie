import {
  fleetShipsDataSelectorFactory,
} from 'views/utils/selectors'
import { getFleetSpeed } from 'views/utils/game-utils'

import {
  shipTextSelectorFactory,
} from './selectors'

import { Target } from '../target'

class FastFleet {
  static type = 'fast-fleet'

  static defValue = {
  }

  static title = "Fast Fleet"

  static isValidObj = () => true

  static describe = () => "Require a fast fleet"

  static prepare = obj => checkerContext => {
    const { target } = obj
    const fleetId = Target.destruct({fleet: x => x})(target)
    const fleetInd = fleetId-1
    const isFast = speed => speed >= 10

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
}

export {
  FastFleet,
}
