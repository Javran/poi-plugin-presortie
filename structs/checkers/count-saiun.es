import _ from 'lodash'

import {
  fleetShipsEquipDataSelectorFactory,
} from 'views/utils/selectors'

import { CheckMethod } from './common'

class CountSaiun {
  static type = 'count-saiun'

  static defValue = {
    method: {type: 'ge', value: 1},
  }

  static title = "Require Saiuns"

  static isValid = obj =>
    CheckMethod.isValidInRange(0,6)(obj.method)

  static describe = obj => {
    const {method} = obj
    return `Number of Saiuns in Fleet ${CheckMethod.describe(method)}`
  }

  static isSaiun = equipId =>
    [
      54, // 彩雲
      212, // 彩雲(東カロリン空)
    ].includes(equipId)

  static prepare = checker => {
    const {method} = checker
    const satisfy = CheckMethod.toFunction(method)
    return checkerContext => {
      const {fleetId} = checkerContext
      const fleetInd = fleetId-1
      const processEquip = equipInfo => {
        if (!equipInfo)
          return []
        const [_equip,$equip] = equipInfo
        return $equip && typeof $equip.api_id === 'number' ?
          [$equip.api_id] : []
      }
      const equipsIds = _.flatMap(
        fleetShipsEquipDataSelectorFactory(fleetInd)(checkerContext),
        fleetShipsEquip =>
          Array.isArray(fleetShipsEquip)
            ? _.flatMap(
              fleetShipsEquip,
              processEquip)
            : [])
      const saiunCount = equipsIds.filter(CountSaiun.isSaiun).length
      return satisfy(saiunCount) ? [] : [`Current Number of equipped Saiuns: ${saiunCount}`]
    }
  }
}

export {
  CountSaiun,
}
