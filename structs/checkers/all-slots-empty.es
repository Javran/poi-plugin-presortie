import _ from 'lodash'

import {
  fleetShipsDataSelectorFactory,
  shipEquipDataSelectorFactory,
} from 'views/utils/selectors'

import { CheckMethod } from './common'
import {
  shipTextSelectorFactory,
} from './selectors'

import { Target } from '../target'

class AllSlotsEmpty {
  static type = 'all-slots-empty'

  static defValue = {
    method: {type: 'eq', value: 0},
    ignoreExtra: false,
    ignoreUnlocked: true,
  }

  static title = 'Ships without Equipments'

  static isValidObj = obj =>
    CheckMethod.isValidInRange(0,12)(obj.method)

  static isValidTarget = target =>
    ['fleet', 'combined'].includes(Target.getType(target))

  static describe = obj => {
    const {method, ignoreExtra, ignoreUnlocked} = obj

    const ignoreExtraText = ignoreExtra ? 'ignoring extra slots' : null
    const ignoreUnlockedText = ignoreUnlocked ? 'ignoring unlocked ships' : null

    return [
      `Ships without Equipments ${CheckMethod.describe(method)}`,
      ignoreExtraText, ignoreUnlockedText,
    ].filter(x => x).join(', ')
  }

  static prepare = checker => {
    const {method, ignoreExtra, ignoreUnlocked, target} = checker
    const applyIgnoreExtra = ignoreExtra ? _.initial : _.identity
    const satisfy = CheckMethod.toFunction(method)
    return checkerContext => {
      const emptySlotShipsForFleet = fleetId => {
        const isAllSlotsEmpty = shipEquipData =>
          shipEquipData.every(e => !e)
        const fleetInd = fleetId-1
        const shipsEquips =
          fleetShipsDataSelectorFactory(fleetInd)(checkerContext)
            .filter(([ship]) =>
              typeof ship !== 'undefined' &&
              (ship.api_locked === 1 || !ignoreUnlocked))
            .map(([ship]) => ({
              rosterId: ship.api_id,
              allSlotsEmpty:
              isAllSlotsEmpty(
                applyIgnoreExtra(
                  shipEquipDataSelectorFactory(ship.api_id)(checkerContext))),
            }))
        return shipsEquips.filter(s => s.allSlotsEmpty)
      }
      const emptySlotShips = Target.destruct({
        fleet: fleetId => emptySlotShipsForFleet(fleetId),
        combined: () => _.flatMap([1,2], emptySlotShipsForFleet),
      })(target)
      return satisfy(emptySlotShips.length) ?
        [] :
        emptySlotShips.map(s => {
          const shipText = shipTextSelectorFactory(s.rosterId)(checkerContext)
          return `${shipText}: all slots are empty`
        })
    }
  }
}

export {
  AllSlotsEmpty,
}
