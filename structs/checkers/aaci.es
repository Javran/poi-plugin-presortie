import _ from 'lodash'
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

  static title = 'Anti-Air Cut-In'

  static isValidObj = obj =>
    CheckMethod.isValidInRange(0,12)(obj.method)

  static isValidTarget = target =>
    ['fleet', 'combined'].includes(Target.getType(target))

  static describe = obj => {
    const {method} = obj
    return `AACI-capable ships ${CheckMethod.describe(method)}`
  }

  static prepare = checker => {
    const {method, target} = checker
    const satisfy = CheckMethod.toFunction(method)

    return checkerContext => {
      const aaciCapablesForFleet = fleetId => {
        const fleetInd = fleetId-1
        const rosterIds = fleetShipsDataSelectorFactory(fleetInd)(checkerContext)
          .filter(([ship]) => ship && typeof ship.api_id === 'number')
          .map(([ship]) => ship.api_id)
        const aaciCapables = rosterIds.filter(rosterId =>
          AACISelectorFactory(rosterId)(checkerContext).length > 0)
        return aaciCapables
      }

      const aaciCapables = Target.destruct({
        fleet: aaciCapablesForFleet,
        combined: () => _.flatMap([1,2], aaciCapablesForFleet),
      })(target)

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
