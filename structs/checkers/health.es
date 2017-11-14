import {
  fleetShipsDataSelectorFactory,
} from 'views/utils/selectors'

import { CheckMethod } from './common'
import { shipTextSelectorFactory } from './selectors'
import { Target } from '../target'

class Health {
  static type = 'health'

  static defValue = {
    healthStates: ['taiha','chuuha'],
    ignoreUnlocked: false,
    method: {type: 'eq', value: 0},
  }

  static allHealthStates = [
    'taiha', 'chuuha', 'shouha', 'normal', 'full',
  ]

  static title = "Health"

  static isValidObj = obj =>
    CheckMethod.isValidInRange(0,6)(obj.method)

  static describe = obj => {
    const { method, ignoreUnlocked, healthStates } = obj
    // we iterate allHealthStates
    // instead of iterating directly on healthStates
    // to produce a stable ordering
    const healthStateText = Health.allHealthStates
      .filter(hs => healthStates.includes(hs))
      .join('/')
    return [
      `# of ships with ${healthStateText} state ${CheckMethod.describe(method)}`,
      ignoreUnlocked ? 'ignoring unlocked ships' : null,
    ].filter(x => x !== null).join(', ')
  }

  static computeHealthState = (curHp, maxHp) => {
    if (typeof curHp !== 'number' ||
        typeof maxHp !== 'number')
      console.error('expecting curHp and maxHp to be numbers')
    if (curHp === maxHp)
      return 'full'
    const rate = curHp / maxHp
    /* eslint-disable indent */
    return rate <= 0.25 ? 'taiha' :
      rate <= 0.5 ? 'chuuha' :
      rate <= 0.75 ? 'shouha' :
      'normal'
    /* eslint-enable indent */
  }

  static prepare = checker => {
    const {method, healthStates, ignoreUnlocked, target} = checker
    const fleetId = Target.destruct({fleet: x => x})(target)
    const fleetInd = fleetId-1

    const satisfy = CheckMethod.toFunction(method)
    return checkerContext => {
      const isValidShip = s => {
        if (!Array.isArray(s))
          return false
        const [ship] = s
        return ship.api_locked === 1 || !ignoreUnlocked
      }

      const ships = fleetShipsDataSelectorFactory(fleetInd)(checkerContext)
        .filter(isValidShip)
        .map( ([ship]) => ({
          rosterId: ship.api_id,
          healthState: Health.computeHealthState(ship.api_nowhp,ship.api_maxhp),
        }))
      const qualifiedShips = ships.filter(s => healthStates.includes(s.healthState))
      const count = qualifiedShips.length
      return satisfy(count)
        ? []
        : (
          ships.length === 0 ?
            ['No ship in this fleet'] :
            ships.map(s => `${shipTextSelectorFactory(s.rosterId)(checkerContext)}: ${s.healthState}`)
        )
    }
  }
}

export {
  Health,
}
