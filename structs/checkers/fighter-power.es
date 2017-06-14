import { CheckMethod } from './common'

class FighterPower {
  static type = 'fighter-power'

  static defValue = {
    type: FighterPower.type,
    method: {type: 'ge', value: 350},
  }

  static title = "Fighter Power"

  static isValid = obj =>
    obj.type === FighterPower.type &&
    CheckMethod.isValidInRange(0,+Infinity)(obj.method)
}

export {
  FighterPower,
}
