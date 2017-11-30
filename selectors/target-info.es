import { createSelector } from 'reselect'

import {
  fleetsSelector,
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
// const targetInfoListSelector = createSelector(
// )
