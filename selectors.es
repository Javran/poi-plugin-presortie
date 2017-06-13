import { createSelector } from 'reselect'

import {
  constSelector,
  fleetsSelector,
  shipsSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'
import { _ } from 'lodash'

import { DynMapId, MapExtra } from './structs'
import { initState } from './reducer'

const splitMapId = mapId => ({
  world: Math.floor(mapId/10),
  area: mapId % 10,
})

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-presortie'),
  extStore => _.isEmpty(extStore) ? initState : extStore)

const mapInfoArraySelector = createSelector(
  constSelector,
  ({$maps}) => {
    const transform = raw => {
      const id = raw.api_id
      const name = raw.api_name
      const {world, area} = splitMapId(id)
      return {id, name, world, area}
    }
    return Object.values($maps)
      .map(transform)
      .sort((x,y) => x.id - y.id)
  })

const dynamicMapIdSelector = createSelector(
  extSelector,
  extState => extState.dynMapId
)

const currentMapIdSelector = createSelector(
  extSelector,
  dynamicMapIdSelector,
  (extState,dynMapId) => DynMapId.toMapId(
    dynMapId, extState.sortieHistory))

const currentFleetIdSelector = createSelector(
  extSelector,
  extState => extState.curFleetId)

const currentMapExtraSelector = createSelector(
  extSelector,
  currentMapIdSelector,
  (extState,curMapId) => {
    const mapExtra = extState.mapExtras[curMapId]
    return typeof mapExtra === 'undefined' ? MapExtra.empty : mapExtra
  })

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

const presortieMainUISelector = createSelector(
  mapInfoArraySelector,
  extSelector,
  dynamicMapIdSelector,
  currentMapIdSelector,
  currentMapExtraSelector,
  (mapInfoArray, extState, dynMapId, curMapId, curMapExtra) => {
    const {
      ready,
      sortieHistory,
    } = extState

    return {
      mapInfoArray,
      sortieHistory: !ready ? [] : sortieHistory,
      dynMapId, curMapId, curMapExtra,
    }
  }
)

const checklistUISelector = createSelector(
  currentFleetIdSelector,
  allFleetInfoSelector,
  (fleetId, allFleetInfo) => ({fleetId, allFleetInfo}))

export {
  mapInfoArraySelector,
  extSelector,
  presortieMainUISelector,
  currentFleetIdSelector,
  checklistUISelector,
}
