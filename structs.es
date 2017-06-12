class MapInfo {
  static toString = ({world, area, name}) =>
    `${world}-${area}: ${name}`

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

export {
  MapInfo,
  DynMapId,
}
