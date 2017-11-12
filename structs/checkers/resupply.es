import {
  fleetShipsDataSelectorFactory,
} from 'views/utils/selectors'

import { CheckMethod } from './common'
import { shipTextSelectorFactory } from './selectors'
import { Target } from '../target'

class Resupply {
  static type = 'resupply'

  static defValue = {
    filterMethod: {type: 'lt', value: 100},
    qualifyMethod: {type: 'eq', value: 0},
    ignoreUnlocked: false,
    resource: 'fuel-and-ammo',
  }

  static title = "Resupply"

  static isValid = obj =>
    CheckMethod.isValidInRange(0,100)(obj.filterMethod) &&
    CheckMethod.isValidInRange(0,6)(obj.qualifyMethod)

  static describe = obj => {
    const {
      qualifyMethod, filterMethod,
      ignoreUnlocked, resource,
    } = obj

    const resourceHead =
      resource === 'fuel-and-ammo' ? 'Fuel & Ammo' :
      resource === 'fuel' ? 'Fuel' :
      resource === 'ammo' ? 'Ammo' :
      resource

    const resupplyStateText = `${resourceHead} ${CheckMethod.describe(filterMethod)}%`

    return [
      `# of ships with resupply "${resupplyStateText}"` +
      ` ${CheckMethod.describe(qualifyMethod)}`,
      ignoreUnlocked ? 'ignoring unlocked ships' : null,
    ].filter(x => x !== null).join(', ')
  }

  static getFuelPercentage = ([ship,$ship]) =>
    ship.api_fuel / $ship.api_fuel_max * 100

  static getAmmoPercentage = ([ship,$ship]) =>
    ship.api_bull / $ship.api_bull_max * 100

  static prepare = checker => {
    const {filterMethod, qualifyMethod, ignoreUnlocked, resource, target} = checker
    const fleetId = Target.destruct({fleet: x => x})(target)
    const fleetInd = fleetId-1
    const filterSatisfy = CheckMethod.toFunction(filterMethod)
    const testResupplyStatus =
      resource === 'fuel-and-ammo' ? (shipInfo =>
        filterSatisfy(Resupply.getFuelPercentage(shipInfo)) &&
        filterSatisfy(Resupply.getAmmoPercentage(shipInfo))) :
      resource === 'fuel' ? shipInfo =>
        filterSatisfy(Resupply.getFuelPercentage(shipInfo)) :
      resource === 'ammo' ? shipInfo =>
        filterSatisfy(Resupply.getAmmoPercentage(shipInfo)) :
      console.error(`Unknown resource: ${resource}`)

    const satisfy = CheckMethod.toFunction(qualifyMethod)
    return checkerContext => {
      const isValidShip = s => {
        if (!Array.isArray(s))
          return false
        const [ship] = s
        return ship.api_locked === 1 || !ignoreUnlocked
      }

      const ships = fleetShipsDataSelectorFactory(fleetInd)(checkerContext)
        .filter(isValidShip)
      const filteredShips = ships.filter(testResupplyStatus)

      const toShipText = shipInfo => {
        const [ship] = shipInfo
        const shipName = shipTextSelectorFactory(ship.api_id)(checkerContext)
        const fuelText =
          ['fuel', 'fuel-and-ammo'].includes(resource) &&
          `Fuel: ${Resupply.getFuelPercentage(shipInfo)}%`
        const ammoText =
          ['ammo', 'fuel-and-ammo'].includes(resource) &&
          `Ammo: ${Resupply.getAmmoPercentage(shipInfo)}%`
        return [
          shipName,
          fuelText,
          ammoText,
        ].filter(x => x).join(', ')
      }

      return satisfy(filteredShips.length) ?
        [] :
        (
          ships.length === 0 ?
            ['No ship in this fleet'] :
            ships.map(toShipText)
        )
    }
  }
}

export {
  Resupply,
}
