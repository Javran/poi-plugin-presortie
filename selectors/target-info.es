import _ from 'lodash'
import { createSelector } from 'reselect'

import {
  fleetsSelector,
  constSelector,
} from 'views/utils/selectors'

/*
   TODO: return an Array of <TargetInfo> or "sep-X" where X is a number
   just for making "sep-X" strings unique

   A TargetInfo contains: {target: <Target>, available: <bool>}
   with best guess of the current availablity for targets:
   (Note: availablity means that the player can actually change the configuration
   of that specific target: e.g. an unlocked empty fleet is considered available,
   but a not-yet unlocked lbas is considered not.

   - fleet type: available=false when the fleet is not yet unlocked
   - combined type: available=false when where is no area id greater or equal to 30
     (TODO: some other way of knowing whether a combined fleet is possible?)
   - lbas type: available only when both the world and the squadron exist.

   "sep-X" can be included in the resulting Array which corresponds
   to separators.

 */

const fleetTargetInfoListSelector = createSelector(
  fleetsSelector,
  (fleetsRaw = []) =>
    fleetsRaw.map(fleetRaw => {
      const fleetId = fleetRaw.api_id
      return {
        target: `fleet-${fleetId}`,
        available: Array.isArray(fleetRaw.api_ship),
      }
    })
)

const isCombinedFleetAvailableSelector = createSelector(
  constSelector,
  ({$maps = {}}) =>
    Object.values($maps).some(mapRaw => {
      const combinedFlag = _.get(mapRaw, ['api_sally_flag',1])
      return _.isInteger(combinedFlag) && combinedFlag !== 0
    })
)

const grouppedLbasTargetInfoSelector = createSelector(
  state => state.info.airbase,
  (airbaseRaw = []) =>
    // fill in blanks, assuming we can at least have 3 squadrons
    // for each area (some might be unlocked by clearing maps)
    _.mapValues(
      // group squadrons by area
      _.groupBy(
        airbaseRaw.map(abRaw => {
          const areaId = abRaw.api_area_id
          const sqId = abRaw.api_rid
          return {
            target: `lbas-${areaId}-${sqId}`,
            available: true,
            areaId, sqId,
          }
        }),
        'areaId'
      ),
      (xs, areaIdStr) => {
        const areaId = Number(areaIdStr)
        const first3 = [1,2,3].map(sqId => {
          const targetInfo = xs.find(x => x.sqId === sqId)
          if (targetInfo) {
            return targetInfo
          } else {
            return {
              target: `lbas-${areaId}-${sqId}`,
              available: false,
              areaId, sqId,
            }
          }
        })

        const remaining = xs.filter(x => ![1,2,3].includes(x.sqId))
        if (remaining.length !== 0) {
          console.warn(
            `receiving more than 3 lbas TargetInfo for area ${areaId}`,
            remaining,
          )
          return [...first3, ...remaining]
        } else {
          return first3
        }
      }
    )
)

const targetInfoListSelector = createSelector(
  fleetTargetInfoListSelector,
  isCombinedFleetAvailableSelector,
  grouppedLbasTargetInfoSelector,
  (fleetTargetInfoList, isCombinedFleetAvailable, grouppedLbasTargetInfo) => {
    // want to sort it in a way that event lbas goes first
    const sortedLbasAreas =
      Object.keys(grouppedLbasTargetInfo).map(Number).sort((x,y) => y-x)
    const targetInfoGroups = [
      fleetTargetInfoList,
      [{target: 'combined', available: isCombinedFleetAvailable}],
      ...sortedLbasAreas.map(areaId => grouppedLbasTargetInfo[areaId]),
    ]

    return _.flatMap(
      targetInfoGroups,
      (group, ind) => {
        if (ind+1 < targetInfoGroups.length) {
          return [...group, `sep-${ind}`]
        } else {
          return group
        }
      }
    )
  }
)

export {
  targetInfoListSelector,
}
