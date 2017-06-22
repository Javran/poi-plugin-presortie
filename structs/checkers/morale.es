import { CheckMethod } from './common'

class Morale {
  static type = 'morale'

  static defValue = {
    type: Morale.type,
    filterMethod: {type: 'lt', value: 30},
    qualifyMethod: {type: 'eq', value: 0},
    ignoreUnlocked: true,
  }

  static title = "Morale"

  static isValid = obj =>
    obj.type === Morale.type &&
    CheckMethod.isValidInRange(0,100)(obj.filterMethod) &&
    CheckMethod.isValidInRange(0,6)(obj.qualifyMethod)

  static describe = obj => {
    const {
      qualifyMethod, filterMethod, ignoreUnlocked,
    } = obj

    return [
      `# of ships with "morale ${CheckMethod.describe(filterMethod)}"` +
      ` ${CheckMethod.describe(qualifyMethod)}`,
      ignoreUnlocked ? 'ignoring unlocked ships' : null,
    ].filter(x => x !== null).join(', ')
  }
}

export {
  Morale,
}
