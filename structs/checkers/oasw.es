import { CheckMethod } from './common'

class OASW {
  static type = 'oasw'

  static defValue = {
    type: OASW.type,
    method: {type: 'ge', value: 1},
  }

  static title = "Opening Anti-Submarine Warfare"

  static isValid = obj =>
    obj.type === OASW.type &&
    CheckMethod.isValidInRange(0,6)(obj.method)
}

export {
  OASW,
}
