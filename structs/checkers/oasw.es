import {
  fleetShipsDataSelectorFactory,
} from 'views/utils/selectors'

import { CheckMethod } from './common'
import { OASWSelectorFactory } from './selectors'

class OASW {
  static type = 'oasw'

  static defValue = {
    method: {type: 'ge', value: 1},
  }

  static title = "Opening Anti-Submarine Warfare"

  static isValid = obj =>
    CheckMethod.isValidInRange(0,6)(obj.method)

  static describe = obj => {
    const {method} = obj
    return `OASW-capable ships ${CheckMethod.describe(method)}`
  }

  static prepare = checker => {
    const {method} = checker
    const satisfy = CheckMethod.toFunction(method)

    return checkerContext => {
      const { fleetId } = checkerContext
      const fleetInd = fleetId-1
      const rosterIds = fleetShipsDataSelectorFactory(fleetInd)(checkerContext)
        .filter( ([ship]) => ship && typeof ship.api_id === 'number')
        .map(([ship]) => ship.api_id)
      const oaswCapables = rosterIds.filter(rosterId =>
        OASWSelectorFactory(rosterId)(checkerContext))
      const oaswCount = oaswCapables.length
      return satisfy(oaswCount)
        ? []
        : [`Current number of OASW-capable ships: ${oaswCount}`]
    }
  }
}

export {
  OASW,
}
