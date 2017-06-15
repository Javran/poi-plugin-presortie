import { CheckMethod } from './common'

class HasRadar {
  static type = 'has-radar'

  static defValue = {
    type: HasRadar.type,
    method: {type: 'ge', value: 3},
  }

  static title = "Require Radars"

  static isValid = obj =>
    obj.type === HasRadar.type &&
    CheckMethod.isValidInRange(0,6)(obj.method)

  static describe = obj => {
    const {method} = obj
    return `Ships Equipped with Radar ${CheckMethod.describe(method)}`
  }

}

export {
  HasRadar,
}
