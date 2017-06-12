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
    const mapInfoArray = Object.values($maps)
      .map(transform)
      .sort((x,y) => x.id - y.id)
    return {mapInfoArray}
  })

export {
  mapInfoArraySelector,
  extSelector,
}
