/*
   - some selectors are implemented here
     instead of 'selectors.es' under project root
     to avoid potential problems caused by circular imports.

   - for the reason above, selectors in this module
     should only depend on 'views/utils/selectors'
 */

import { _ } from 'lodash'
import { createSelector } from 'reselect'

import {
  shipDataSelectorFactory,
} from 'views/utils/selectors'

// rosterId => <name> Lv.<level> (<rosterId>)
// assumes rosterId is always valid
const shipTextSelectorFactory = rosterId =>
  createSelector(
    shipDataSelectorFactory(rosterId),
    ([ship, $ship]) => `${$ship.api_name} Lv.${ship.api_lv} (${rosterId})`)

export {
  shipTextSelectorFactory,
}
