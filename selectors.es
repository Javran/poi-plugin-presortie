import { createSelector } from 'reselect'

import {
  constSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'

const splitMapId = mapId => ({
  world: Math.floor(mapId/10),
  area: mapId % 10,
})

const extSelector =
  extensionSelectorFactory('poi-plugin-presortie')

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

const presortieMainUISelector = createSelector(
  mapInfoArraySelector,
  extSelector,
  dynamicMapIdSelector,
  (mapInfoArray, extState, dynMapId) => {
    const {
      ready,
      sortieHistory,
    } = extState

    return {
      mapInfoArray,
      sortieHistory: !ready ? [] : sortieHistory,
      dynMapId,
    }
  }
)

export {
  mapInfoArraySelector,
  extSelector,
  presortieMainUISelector,
}
