import { Checkers, checkerList } from './checkers'

const expectObject = f => x =>
  typeof x === 'object'
    ? f(x)
    : console.error(`Expecting an Object while value of type ${typeof x} is received`)

const reportTypeError = (cls,actualType) =>
  console.error(`Invalid ${cls.name} type: ${actualType}`)

class MapInfo {
  static toString = ({area, num, name}) =>
    `${area}-${num}: ${name}`

  static toShortString = ({area, num}) =>
    `${area}-${num}`

  static findMapInfo = mapInfoArray => mapId =>
    mapInfoArray.find(x => x.id === mapId)
}

class DynMapId {
  /* eslint-disable indent */
  static toMapId = (dynMapId, sortieHistory) =>
    dynMapId === 'last' ?
      (sortieHistory.length === 0 ?
        11 /* 1-1 by def */ :
        sortieHistory[0]) :
    dynMapId
  /* eslint-enable indent */
}

class SelectedMap {
  /* eslint-disable indent */
  static destruct = ({id, last}) => expectObject(obj =>
    obj.type === 'id' ? id(obj.mapId,obj) :
    obj.type === 'last' ? last(obj) :
    reportTypeError(SelectedMap, obj.type)
  )
  /* eslint-enable indent */
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

const emptyMemo = {
  checklist: [],
  notes: [],
  links: [],
}

export {
  MapInfo,
  DynMapId,
  MapExtra,
  SelectedMap,

  Checkers,
  checkerList,

  emptyMemo,
}
