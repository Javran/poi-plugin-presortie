import {
  fleetShipsDataSelectorFactory,
} from 'views/utils/selectors'

import { CheckMethod } from './common'
import { AACISelectorFactory } from './selectors'

import { Target } from '../target'

class AACI {
  static type = 'aaci'

  static defValue = {
    method: {type: 'ge', value: 1},
  }

  static title = "Anti-Air Cut-In"

  static isValidObj = obj =>
    CheckMethod.isValidInRange(0,6)(obj.method)

  static describe = obj => {
    const {method} = obj
    return `AACI-capable ships ${CheckMethod.describe(method)}`
  }

  static prepare = checker => {
    const {method, target} = checker
    const fleetId = Target.destruct({fleet: x => x})(target)
    const fleetInd = fleetId-1
    const satisfy = CheckMethod.toFunction(method)

    return checkerContext => {
      const rosterIds = fleetShipsDataSelectorFactory(fleetInd)(checkerContext)
        .filter( ([ship]) => ship && typeof ship.api_id === 'number')
        .map(([ship]) => ship.api_id)
      const aaciCapables = rosterIds.filter(rosterId =>
        AACISelectorFactory(rosterId)(checkerContext).length > 0)
      const aaciCount = aaciCapables.length
      return satisfy(aaciCount)
        ? []
        : [`Current number of AACI-capable ships: ${aaciCount}`]
    }
  }
}

export {
  AACI,
}
