import {
  fleetShipsDataSelectorFactory,
} from 'views/utils/selectors'
import { getFleetSpeed } from 'views/utils/game-utils'

import {
  shipTextSelectorFactory,
} from './selectors'

class FastFleet {
  static type = 'fast-fleet'

  static defValue = {
    type: FastFleet.type,
  }

  static title = "Require Fast Fleet"

  static isValid = obj =>
    obj.type === FastFleet.type

  static describe = () => "Fast Fleet"

  static prepare = () => checkerContext => {
    const { fleetId } = checkerContext
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
