import _ from 'lodash'
import {
  fleetShipsEquipDataSelectorFactory,
} from 'views/utils/selectors'

import { CheckMethod } from './common'

class YasenEquips {
  static type = 'yasen-equips'

  static defValue = {
    searchlight: {type: 'ge', value: 1},
    starShell: {type: 'ge', value: 1},
    nightRecon: {type: 'ge', value: 1},
    // effectively "don't take skilled-lookouts into account"
    skilledLookouts: {type: 'ge', value: 0},
  }

  static title = "Night Battle Related Equipments"

  static methodFieldNames = [
    'searchlight',
    'starShell',
    'nightRecon',
    'skilledLookouts',
  ]

  static equipmentNames = {
    searchlight: 'Searchlight',
    starShell: 'Star Shell',
    nightRecon: 'Night Recon',
    skilledLookouts: 'Skilled Lookouts',
  }

  static isValid = obj =>
    YasenEquips.methodFieldNames.every(fieldName =>
      CheckMethod.isValidInRange(0,Infinity)(obj[fieldName]))

  static describe = obj => {
    const eqpReqs = YasenEquips.methodFieldNames
      .map(fieldName =>
        `${YasenEquips.equipmentNames[fieldName]} ${CheckMethod.describe(obj[fieldName])}`)
      .join(', ')
    return `Night battle related equipments: ${eqpReqs}`
  }

  static isEquipment = {
    searchlight: eqpId => [
      74, // 探照灯
      140, // 96式150cm探照灯
    ].includes(eqpId),
    starShell: eqpId => eqpId === 101,
    nightRecon: eqpId => eqpId === 102,
    skilledLookouts: eqpId => eqpId === 129,
  }

  static prepare = checker => {
    const satFunctions = _.fromPairs(
      YasenEquips.methodFieldNames.map(fieldName =>
        [fieldName, CheckMethod.toFunction(checker[fieldName])]))

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

      const counts = _.fromPairs(
        YasenEquips.methodFieldNames.map(fieldName =>
          [
            fieldName,
            equipsIds.filter(YasenEquips.isEquipment[fieldName]).length,
          ]))

      const unsatCounts = _.flatMap(
        YasenEquips.methodFieldNames,
        fieldName => {
          const count = counts[fieldName]
          const satisfy = satFunctions[fieldName]
          return satisfy(count) ? [] : [{fieldName, count}]
        })

      return unsatCounts.map( ({fieldName, count}) => {
        const equipmentName = YasenEquips.equipmentNames[fieldName]
        return `${equipmentName}: ${count}`
      })
    }
  }
}

export {
  YasenEquips,
}
