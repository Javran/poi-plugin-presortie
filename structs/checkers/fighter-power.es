import { CheckMethod } from './common'
import { tykuSelectorFactory } from './selectors'

class FighterPower {
  static type = 'fighter-power'

  static defValue = {
    method: {type: 'ge', value: 350},
    mode: 'min',
  }

  static title = "Fighter Power"

  static isValid = obj =>
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
    const {method, mode} = checker
    const modeText = FighterPower.describeMode(mode)
    const satisfy =
      tyku => CheckMethod.toFunction(method)(tyku[mode])

    return checkerContext => {
      const { fleetId } = checkerContext
      const fleetInd = fleetId-1
      const tyku = tykuSelectorFactory(fleetInd)(checkerContext)
      return satisfy(tyku) ? [] : [`Current Fighter Power (${modeText}) is ${tyku[mode]}`]
    }
  }
}

export {
  FighterPower,
}
