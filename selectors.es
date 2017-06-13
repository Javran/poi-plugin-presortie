import { createSelector } from 'reselect'

import {
  constSelector,
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

const currentMapExtraSelector = createSelector(
  extSelector,
  currentMapIdSelector,
  (extState,curMapId) => {
    const mapExtra = extState.mapExtras[curMapId]
    return typeof mapExtra === 'undefined' ? MapExtra.empty : mapExtra
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

export {
  mapInfoArraySelector,
  extSelector,
  presortieMainUISelector,
}
