import { CheckMethod } from './common'

class YasenEquips {
  static type = 'yasen-equips'

  static defValue = {
    type: YasenEquips.type,
    searchlight: {type: 'ge', value: 1},
    starShell: {type: 'ge', value: 1},
    nightRecon: {type: 'ge', value: 1},
    // effectively "don't take skilled-lookouts into account"
    skilledLookouts: {type: 'ge', value: 0},
  }

  static title = "Night Battle Related Equipments"

  static isValid = obj =>
    obj.type === YasenEquips.type &&
    CheckMethod.isValidInRange(0,Infinity)(obj.searchlight) &&
    CheckMethod.isValidInRange(0,Infinity)(obj.starShell) &&
    CheckMethod.isValidInRange(0,Infinity)(obj.nightRecon) &&
    CheckMethod.isValidInRange(0,Infinity)(obj.skilledLookouts)

  static describe = obj => {
    const {
      searchlight, starShell,
      nightRecon, skilledLookouts,
    } = obj
    const eqpReqs = [
      `Searchlight ${CheckMethod.describe(searchlight)}`,
      `Star Shell ${CheckMethod.describe(starShell)}`,
      `Night Recon ${CheckMethod.describe(nightRecon)}`,
      `Skilled Lookouts ${CheckMethod.describe(skilledLookouts)}`,
    ].join(', ')
    return `Night battle related equipments: ${eqpReqs}`
  }
}

export {
  YasenEquips,
}
