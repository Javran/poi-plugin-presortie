/*
   - some selectors are implemented here
     instead of 'selectors.es' under project root
     to avoid potential problems caused by circular imports.

   - for the reason above, selectors in this module
     should only depend on 'views/utils/selectors'
 */

import { _, memoize } from 'lodash'
import { createSelector } from 'reselect'

import {
  shipDataSelectorFactory,
  shipEquipDataSelectorFactory,
} from 'views/utils/selectors'

import { getShipAACIs } from 'views/utils/aaci'

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

export {
  shipTextSelectorFactory,
  AACISelectorFactory,
}
