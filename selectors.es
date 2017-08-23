import { createSelector } from 'reselect'
import { projectorToComparator } from 'subtender'
import _ from 'lodash'

import {
  constSelector,
  fleetsSelector,
  shipsSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'


import { SelectedMap, emptyMemo } from './structs'
import { initState } from './store'

/*

   - use `area` and `num` (e.g. area=5, num=4 for mapId=54)

 */
const splitMapId = mapId => ({
  area: Math.floor(mapId/10),
  num: mapId % 10,
})

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-presortie'),
  extStore => _.isEmpty(extStore) ? initState : extStore
)

const mkExtPropSelector = _.memoize(propName =>
  createSelector(extSelector, ext => ext[propName]))

const sortieHistorySelector =
  mkExtPropSelector('sortieHistory')
const persistSelector =
  mkExtPropSelector('persist')

const fleetIdSelector = createSelector(
  persistSelector,
  p => p.fleetId
)

const mapMemosSelector = createSelector(
  persistSelector,
  p => p.mapMemos
)

const selectedMapSelector = createSelector(
  persistSelector,
  p => p.selectedMap
)

const mapIdSelector = createSelector(
  selectedMapSelector,
  sortieHistorySelector,
  (selectedMap, sortieHistory) =>
    SelectedMap.destruct({
      id: mapId => mapId,
      last: () =>
        sortieHistory.length > 0 ?
          sortieHistory[0] :
          // 1-1, if no history can be found
          11,
    })(selectedMap)
)

const mapInfoArraySelector = createSelector(
  constSelector,
  ({$maps}) => {
    const transform = raw => {
      const id = raw.api_id
      const name = raw.api_name
      const {area, num} = splitMapId(id)
      return {id, name, area, num}
    }
    return Object.values($maps)
      .map(transform)
      .sort(projectorToComparator(x => x.id))
  }
)

const mapInfoSelector = createSelector(
  mapInfoArraySelector,
  mapIdSelector,
  (mapInfoArray, mapId) =>
    mapInfoArray.find(x => x.id === mapId)
)

const mapMemoSelector = createSelector(
  mapMemosSelector,
  mapIdSelector,
  (mapMemos, mapId) =>
    mapMemos[mapId] || emptyMemo
)

const checklistSelector = createSelector(
  mapMemoSelector,
  m => m.checklist
)

const notesSelector = createSelector(
  mapMemoSelector,
  m => m.notes
)

const linksSelector = createSelector(
  mapMemoSelector,
  m => m.links
)

const allFleetInfoSelector = createSelector(
  fleetsSelector,
  shipsSelector,
  constSelector,
  (fleets,ships,{$ships}) => {
    const nonEmptyFleets = fleets.filter(fleet =>
      Array.isArray(fleet.api_ship) &&
      fleet.api_ship.length > 0 &&
      !fleet.api_ship.every(rid => rid < 0))

    const getShip = rosterId => {
      const ship = ships[rosterId]
      const $ship = $ships[ship.api_ship_id]
      return {
        rosterId,
        level: ship.api_lv,
        name: $ship.api_name,
      }
    }

    const transformFleet = rawFleet => ({
      id: rawFleet.api_id,
      name: rawFleet.api_name,
      flagship: getShip(rawFleet.api_ship[0]),
    })
    return nonEmptyFleets.map(transformFleet)
  })

export {
  extSelector,

  sortieHistorySelector,

  fleetIdSelector,
  mapMemosSelector,
  selectedMapSelector,
  mapIdSelector,

  mapInfoArraySelector,
  mapInfoSelector,

  mapMemoSelector,
  checklistSelector,
  notesSelector,
  linksSelector,

  allFleetInfoSelector,
}
