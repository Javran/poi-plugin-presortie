import {
  fleetShipsEquipDataSelectorFactory,
} from 'views/utils/selectors'

import { CheckMethod } from './common'
import { Target } from '../target'

class HasRadar {
  static type = 'has-radar'

  static defValue = {
    method: {type: 'ge', value: 3},
  }

  static title = "Require Radars"

  static isValid = obj =>
    CheckMethod.isValidInRange(0,6)(obj.method)

  static describe = obj => {
    const {method} = obj
    return `Ships Equipped with Radar ${CheckMethod.describe(method)}`
  }

  static prepare = checker => {
    const {method, target} = checker
    const fleetId = Target.destruct({fleet: x => x})(target)
    const fleetInd = fleetId-1
    const satisfy = CheckMethod.toFunction(method)
    return checkerContext => {
      const isRadar = eq => {
        if (!eq)
          return false
        const [_equip, $equip] = eq
        return [12,13].includes($equip.api_type[2])
      }
      const isRadarIncluded = equips =>
        Array.isArray(equips) &&
        equips.some(isRadar)
      const radarCarrierCount = fleetShipsEquipDataSelectorFactory(fleetInd)(checkerContext)
        .filter(isRadarIncluded)
        .length
      return satisfy(radarCarrierCount) ?
        [] :
        [`Current Number of Ships with Radar: ${radarCarrierCount}`]
    }
  }
}

export {
  HasRadar,
}
