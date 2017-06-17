import { CheckMethod } from './common'

class CountSaiun {
  static type = 'count-saiun'

  static defValue = {
    type: CountSaiun.type,
    method: {type: 'ge', value: 1},
  }

  static title = "Require Saiuns"

  static isValid = obj =>
    obj.type === CountSaiun.type &&
    CheckMethod.isValidInRange(0,6)(obj.method)

  static describe = obj => {
    const {method} = obj
    return `Number of Saiuns in Fleet ${CheckMethod.describe(method)}`
  }
}

export {
  CountSaiun,
}
