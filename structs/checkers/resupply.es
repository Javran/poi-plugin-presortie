import { CheckMethod } from './common'

class Resupply {
  static type = 'resupply'

  static defValue = {
    type: Resupply.type,
    filterMethod: {type: 'lt', value: 100},
    qualifyMethod: {type: 'eq', value: 0},
    ignoreUnlocked: false,
    resource: 'fuel-and-ammo',
  }

  static title = "Resupply"

  static isValid = obj =>
    obj.type === Resupply.type &&
    CheckMethod.isValidInRange(0,100)(obj.filterMethod) &&
    CheckMethod.isValidInRange(0,6)(obj.qualifyMethod)

  static describe = obj => {
    const {
      qualifyMethod, filterMethod,
      ignoreUnlocked, resource,
    } = obj

    const resourceHead =
      resource === 'fuel-and-ammo' ? 'Fuel & Ammo' :
      resource === 'fuel' ? 'Fuel' :
      resource === 'ammo' ? 'Ammo' :
      resource

    const resupplyStateText = `${resourceHead} ${CheckMethod.describe(filterMethod)}%`

    return [
      `# of ships with resupply "${resupplyStateText}"` +
      ` ${CheckMethod.describe(qualifyMethod)}`,
      ignoreUnlocked ? 'ignoring unlocked ships' : null,
    ].filter(x => x !== null).join(', ')
  }
}

export {
  Resupply,
}
