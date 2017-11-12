import _ from 'lodash'
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

class MemoId {
  static destruct = ({mapId, general}) => x => {
    if (x === 'general')
      return general()
    const parsed = Number(x)
    if (_.isInteger(parsed))
      return mapId(parsed)
    console.error(`expecting a MemoId while getting ${x}`)
  }
}

const emptyMemo = {
  checklist: [],
  notes: [],
  links: [],
}

export * from './target'

export {
  expectObject,
  reportTypeError,

  MapInfo,
  MemoId,
  Checkers,
  checkerList,
  emptyMemo,
}
