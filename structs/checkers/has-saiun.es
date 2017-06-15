import { CheckMethod } from './common'

class HasSaiun {
  static type = 'has-saiun'

  static defValue = {
    type: HasSaiun.type,
    method: {type: 'ge', value: 1},
  }

  static title = "Require Saiuns"

  static isValid = obj =>
    obj.type === HasSaiun.type &&
    CheckMethod.isValidInRange(0,6)(obj.method)

  static describe = obj => {
    const {method} = obj
    return `Ships Equipped with Saiun ${CheckMethod.describe(method)}`
  }
}

export {
  HasSaiun,
}
