/*
   - some selectors are implemented here
     instead of 'selectors.es' under project root
     to avoid potential problems caused by circular imports.

   - for the reason above, selectors in this module
     should only depend on 'views/utils/selectors'
 */

import { memoize } from 'lodash'
import { createSelector } from 'reselect'

import {
  basicSelector,
  shipDataSelectorFactory,
  shipEquipDataSelectorFactory,
  fleetShipsDataSelectorFactory,
  fleetShipsEquipDataSelectorFactory,
} from 'views/utils/selectors'

import { getShipAACIs } from 'views/utils/aaci'
import { isOASW } from 'views/utils/oasw'
import {
  getTyku, getSaku33,
} from 'views/utils/game-utils'

// rosterId => <name> Lv.<level> (<rosterId>)
// assumes rosterId is always valid
const shipTextSelectorFactory = rosterId =>
  createSelector(
    shipDataSelectorFactory(rosterId),
    ([ship, $ship]) => `${$ship.api_name} Lv.${ship.api_lv} (${rosterId})`)

const AACISelectorFactory = memoize(shipId =>
  createSelector([
    shipDataSelectorFactory(shipId),
    shipEquipDataSelectorFactory(shipId),
  ], ([_ship = {}, $ship = {}] = [], _equips = []) => {
    const ship = { ...$ship, ..._ship }
    const equips = _equips
      .filter(([_equip, $equip, _onslot] = []) => !!_equip && !!$equip)
      .map(([_equip, $equip, _onslot]) => ({ ...$equip, ..._equip }))
    return getShipAACIs(ship, equips)
  })
)

const OASWSelectorFactory = memoize(shipId =>
  createSelector([
    shipDataSelectorFactory(shipId),
    shipEquipDataSelectorFactory(shipId),
  ], ([_ship = {}, $ship = {}] = [], _equips = []) => {
    const ship = { ...$ship, ..._ship }
    const equips = _equips
      .filter(([_equip, $equip, _onslot] = []) => !!_equip && !!$equip)
      .map(([_equip, $equip, _onslot]) => ({ ...$equip, ..._equip }))
    return isOASW(ship, equips)
  })
)

const tykuSelectorFactory = memoize(fleetInd =>
  createSelector(
    fleetShipsEquipDataSelectorFactory(fleetInd),
    (equipsData=[]) =>
      getTyku(equipsData)
  )
)

const admiralLevelSelector = createSelector(
  basicSelector,
  basic => basic.api_level
)

const sakuSelectorFactoryWithNodeFactor = nodeFactor => memoize(fleetInd =>
  createSelector([
    fleetShipsDataSelectorFactory(fleetInd),
    fleetShipsEquipDataSelectorFactory(fleetInd),
    admiralLevelSelector,
  ], (shipsData=[], equipsData=[], admiralLevel) =>
    getSaku33(shipsData, equipsData, admiralLevel, nodeFactor)))

export {
  shipTextSelectorFactory,
  AACISelectorFactory,
  OASWSelectorFactory,
  tykuSelectorFactory,
  sakuSelectorFactoryWithNodeFactor,
}
