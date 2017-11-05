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

class Target {
  // TODO: more to come, full list:
  // fleet / combined / lbas
  static destruct = ({fleet}) => target => {
    const fleetMatch = /^fleet-(\d+)$/.exec(target)
    if (fleetMatch) {
      const [_ignored, fleetIdStr] = fleetMatch
      const fleetId = Number(fleetIdStr)
      if (! _.isInteger(fleetId) || fleetId < 1 || fleetId > 4) {
        console.warn(`Fleet id might be invalid, got: ${fleetIdStr}`)
      }

      return fleet(fleetId)
    }
    console.error(`expecting a Target while getting ${target}`)
  }

  static toString = Target.destruct({
    fleet: fleetId => `Fleet #${fleetId}`,
  })
}

const emptyMemo = {
  checklist: [],
  notes: [],
  links: [],
}

export {
  expectObject,
  reportTypeError,

  MapInfo,
  MemoId,
  Target,
  Checkers,
  checkerList,
  emptyMemo,
}
