import { CheckMethod } from './common'

class AACI {
  static type = 'aaci'

  static defValue = {
    type: AACI.type,
    method: {type: 'ge', value: 1},
  }

  static title = "Anti-Air Cut-In"

  static isValid = obj =>
    obj.type === AACI.type &&
    CheckMethod.isValidInRange(0,6)(obj.method)
}

export {
  AACI,
}
