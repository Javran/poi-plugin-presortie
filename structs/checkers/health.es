import { CheckMethod } from './common'

class Health {
  static type = 'health'

  static defValue = {
    type: Health.type,
    healthStates: ['taiha','chuuha'],
    ignoreUnlocked: false,
    method: {type: 'eq', value: 0},
  }

  static title = "Health States"

  static isValid = obj =>
    obj.type === Health.type &&
    CheckMethod.isValidInRange(0,6)(obj.method)

  static describe = obj => {
    const { method, ignoreUnlocked } = obj
    return [
      `The number of ships with health state ${CheckMethod.describe(method)}`,
      ignoreUnlocked ? 'ignoring unlocked ships' : null,
    ].filter(x => x !== null).join(', ')
  }
}

export {
  Health,
}
