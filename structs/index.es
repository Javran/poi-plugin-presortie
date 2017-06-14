import { Checkers, checkerList } from './checkers'

class MapInfo {
  static toString = ({world, area, name}) =>
    `${world}-${area}: ${name}`

  static toShortString = ({world, area}) =>
    `${world}-${area}`

  static findMapInfo = mapInfoArray => mapId =>
    mapInfoArray.find(x => x.id === mapId)
}

class DynMapId {
  static toMapId = (dynMapId, sortieHistory) =>
    dynMapId === 'last' ?
      (sortieHistory.length === 0 ?
        11 /* 1-1 by def */ :
        sortieHistory[0]) :
    dynMapId
}

class MapExtra {
  static empty = {
    // TODO
    checklist: [],
    // array of strings in Markdown
    notes: [],
    // array of LinkInfo, require names to be unique
    links: [],
  }
}

export {
  MapInfo,
  DynMapId,
  MapExtra,

  Checkers,
  checkerList,
}
