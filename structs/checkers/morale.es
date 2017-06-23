import {
  fleetShipsDataSelectorFactory,
} from 'views/utils/selectors'

import { CheckMethod } from './common'
import { shipTextSelectorFactory } from './selectors'

class Morale {
  static type = 'morale'

  static defValue = {
    filterMethod: {type: 'lt', value: 30},
    qualifyMethod: {type: 'eq', value: 0},
    ignoreUnlocked: true,
  }

  static title = "Morale"

  static isValid = obj =>
    CheckMethod.isValidInRange(0,100)(obj.filterMethod) &&
    CheckMethod.isValidInRange(0,6)(obj.qualifyMethod)

  static describe = obj => {
    const {
      qualifyMethod, filterMethod, ignoreUnlocked,
    } = obj

    return [
      `# of ships with "morale ${CheckMethod.describe(filterMethod)}"` +
      ` ${CheckMethod.describe(qualifyMethod)}`,
      ignoreUnlocked ? 'ignoring unlocked ships' : null,
    ].filter(x => x !== null).join(', ')
  }

  static prepare = checker => {
    const { filterMethod, qualifyMethod, ignoreUnlocked } = checker
    const filterSatisfy = CheckMethod.toFunction(filterMethod)
    const satisfy = CheckMethod.toFunction(qualifyMethod)

    return checkerContext => {
      const { fleetId } = checkerContext
      const fleetInd = fleetId-1
      const isValidShip = s => {
        if (!Array.isArray(s))
          return false
        const [ship] = s
        return ship.api_locked === 1 || !ignoreUnlocked
      }

      const ships = fleetShipsDataSelectorFactory(fleetInd)(checkerContext)
        .filter(isValidShip)
      const filteredShips = ships.filter(([s]) => filterSatisfy(s.api_cond))

      const toShipText = ([ship]) => {
        const shipName = shipTextSelectorFactory(ship.api_id)(checkerContext)
        return `${shipName}: ${ship.api_cond}`
      }

      return satisfy(filteredShips.length) ?
        [] :
        (ships.length === 0 ?
         ['No ship in this fleet'] :
         ships.map(toShipText))
    }
  }
}

export {
  Morale,
}
