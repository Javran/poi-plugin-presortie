import {
  fleetShipsDataSelectorFactory,
} from 'views/utils/selectors'

import { CheckMethod } from './common'

class AllSlotsEmpty {
  static type = 'all-slots-empty'

  static defValue = {
    type: AllSlotsEmpty.type,
    method: {type: 'eq', value: 0},
    ignoreExtra: false,
    ignoreUnlocked: true,
  }

  static title = "Ships without Equipments"

  static isValid = obj =>
    obj.type === AllSlotsEmpty.type &&
    CheckMethod.isValidInRange(0,6)(obj.method)

  static describe = obj => {
    const {method, ignoreExtra, ignoreUnlocked} = obj

    const ignoreExtraText = ignoreExtra ? "ignoring extra slots" : null
    const ignoreUnlockedText = ignoreUnlocked ? "ignoring unlocked ships" : null

    return [
      `Ships without Equipments ${CheckMethod.describe(method)}`,
      ignoreExtraText, ignoreUnlockedText,
    ].filter(x => x).join(', ')
  }

  static prepare = checker => {
    const {method, ignoreExtra, ignoreUnlocked} = checker
    const satisfy = CheckMethod.toFunction(method)
    return checkerContext => {
      const {fleetId} = checkerContext
      const fleetInd = fleetId-1
      const fleetShipsData =
        fleetShipsDataSelectorFactory(fleetInd)(checkerContext)
      return ["TODO"]
    }
  }
}

export {
  AllSlotsEmpty,
}
