import { createSelector } from 'reselect'

import {
  stateSelector,
  constSelector,
  fleetsSelector,
  shipsSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'
import { _ } from 'lodash'

import { DynMapId, MapExtra } from './structs'
import { initState } from './reducer'

import { Checkers } from './structs/checkers'

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

const enabledCheckersSelector = createSelector(
  currentMapExtraSelector,
  mapExtra => mapExtra.checklist.filter(c => c.enabled))

// a preparedChecker has an extra field "listProblems",
// which is a function that returns a list of problems
// when CheckerContext is applied to it
const preparedCheckersSelector = createSelector(
  enabledCheckersSelector,
  checklist => checklist.map(checker => {
    const checkerClass = Checkers[checker.type]
    let listProblems
    if (typeof checkerClass.prepare === 'function') {
      listProblems = checkerClass.prepare(checker)
    } else {
      console.error(`checker of type ${checker.type} does not have a prepare method`)
      listProblems = () => ["Checker not prepared"]
    }
    return {
      ...checker,
      listProblems,
    }
  }))

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

// a checker context is an Object that stores enough info
// for checkers to do what they are supposed to do.
// this module stores related functions
const checkerContextSelector = createSelector(
  currentMapIdSelector,
  currentFleetIdSelector,
  stateSelector,
  (mapId, fleetId, st) => ({
    mapId, fleetId,
    // "const" and "info" come directly from the store,
    // so CheckerContext will have exactly the same shape
    // as the store (given only these two fields are accessed,
    // which should be a reasonable assumption)
    // This allows reusing selectors as functions.
    const: st.const,
    info: st.info,
  })
)

const checkerResultsSelector = createSelector(
  preparedCheckersSelector,
  checkerContextSelector,
  (preparedCheckers, checkerContext) =>
    preparedCheckers.map(preparedChecker => ({
      ...preparedChecker,
      problems: preparedChecker.listProblems(checkerContext),
    })))

const checkerResultsMapSelector = createSelector(
  checkerResultsSelector,
  checkerResults => checkerResults.reduce(
    (acc,checker) => ({...acc, [checker.id]: checker}),
    {}))

const checklistUISelector = createSelector(
  currentFleetIdSelector,
  allFleetInfoSelector,
  checkerResultsMapSelector,
  (fleetId, allFleetInfo, checkerResultsMap) =>
    ({fleetId, allFleetInfo, checkerResultsMap}))

export {
  mapInfoArraySelector,
  extSelector,
  presortieMainUISelector,
  currentMapIdSelector,
  currentFleetIdSelector,
  checklistUISelector,
  checkerContextSelector,
  checkerResultsSelector,
}
