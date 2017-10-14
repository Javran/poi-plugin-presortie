import { createSelector } from 'reselect'
import { projectorToComparator } from 'subtender'
import _ from 'lodash'

import {
  constSelector,
  fleetsSelector,
  shipsSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'

import { emptyMemo } from './structs'
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

const memosSelector = createSelector(
  persistSelector,
  p => p.memos
)

const userPreferredMemoFocusSelector = createSelector(
  persistSelector,
  p => p.userPreferredMemoFocus
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

const getMapInfoFuncSelector = createSelector(
  mapInfoArraySelector,
  mapInfoArray =>
    _.memoize(
      mapId => mapInfoArray.find(x => x.id === mapId) || null
    )
)

const getMapNameFuncSelector = createSelector(
  getMapInfoFuncSelector,
  getMapInfoFunc =>
    mapId => {
      const info = getMapInfoFunc(mapId)
      return info ? info.name : null
    }
)

const memoIdToDescFuncSelector = createSelector(
  getMapNameFuncSelector,
  getMapName =>
    memoFocus => {
      if (memoFocus === 'general') {
        return 'General'
      }

      const mapId = Number(memoFocus)
      const {area,num} = splitMapId(mapId)
      const mapIdDesc = `${area}-${num}`
      const mayName = getMapName(mapId)
      return mayName ?
        `${mapIdDesc}: ${mayName}` :
        mapIdDesc
    }
)

/*
   some maps, for example, event maps, will disappear
   after server maintenance. to account for this case properly,
   only those appears in master data will be considered "valid"
 */
const validSortieHistorySelector = createSelector(
  sortieHistorySelector,
  getMapInfoFuncSelector,
  (sortieHistory, getMapInfoFunc) =>
    sortieHistory.filter(getMapInfoFunc)
)

const memoFocusSelector = createSelector(
  userPreferredMemoFocusSelector,
  validSortieHistorySelector,
  (userPreferredMemoFocus, sortieHistory) => {
    if (userPreferredMemoFocus === 'last') {
      return (sortieHistory.length > 0) ? String(sortieHistory[0]) : 'general'
    }
    return userPreferredMemoFocus
  }
)

// TODO: fix this later: provide a "general" link
const mapInfoSelector = createSelector(
  mapInfoArraySelector,
  memoFocusSelector,
  (mapInfoArray, memoFocus) => {
    if (memoFocus === 'general')
      return null
    const {mapId} = Number(memoFocus)
    return mapInfoArray.find(x => x.id === mapId) || null
  }
)

const memoSelector = createSelector(
  memosSelector,
  memoFocusSelector,
  (memos, memoFocus) =>
    memos[memoFocus] || emptyMemo
)

const checklistSelector = createSelector(
  memoSelector,
  m => m.checklist
)

const notesSelector = createSelector(
  memoSelector,
  m => m.notes
)

const linksSelector = createSelector(
  memoSelector,
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
  splitMapId,

  sortieHistorySelector,

  fleetIdSelector,
  memosSelector,
  userPreferredMemoFocusSelector,
  memoFocusSelector,

  mapInfoArraySelector,
  mapInfoSelector,

  memoSelector,
  checklistSelector,
  notesSelector,
  linksSelector,

  allFleetInfoSelector,
  getMapNameFuncSelector,
  validSortieHistorySelector,
  memoIdToDescFuncSelector,
}
