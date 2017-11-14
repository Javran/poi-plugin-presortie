import { CheckMethod } from './common'
import { tykuSelectorFactory } from './selectors'

import { Target } from '../target'

class FighterPower {
  static type = 'fighter-power'

  static defValue = {
    method: {type: 'ge', value: 350},
    mode: 'min',
  }

  static title = "Fighter Power"

  static isValidObj = obj =>
    CheckMethod.isValidInRange(0,+Infinity)(obj.method)

  static describeMode = mode =>
    mode === 'min' ? 'Minimum' :
    mode === 'max' ? 'Maximum' :
    mode === 'basic' ? 'Bonus Excluded' :
    mode

  static describe = obj => {
    const {method, mode} = obj
    const modeText =
      mode === 'min' ? 'Minimum' :
      mode === 'max' ? 'Maximum' :
      mode === 'basic' ? 'Bonus Excluded' :
      mode
    return `Fighter Power (${modeText}) ${CheckMethod.describe(method)}`
  }

  static prepare = checker => {
    const {method, mode, target} = checker
    const fleetId = Target.destruct({fleet: x => x})(target)
    const fleetInd = fleetId-1
    const modeText = FighterPower.describeMode(mode)
    const satisfy =
      tyku => CheckMethod.toFunction(method)(tyku[mode])

    return checkerContext => {
      const tyku = tykuSelectorFactory(fleetInd)(checkerContext)
      return satisfy(tyku) ? [] : [`Current Fighter Power (${modeText}) is ${tyku[mode]}`]
    }
  }
}

export {
  FighterPower,
}
