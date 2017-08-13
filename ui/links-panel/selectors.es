import { createSelector } from 'reselect'

import {
  mapInfoSelector,
  linksSelector,
} from '../../selectors'
import { getLinks } from '../../map-links'

const wikiLinksSelector = createSelector(
  mapInfoSelector,
  mapInfo =>
    mapInfo ? getLinks(mapInfo) : []
)

/*
   merge together custom links and those presets.
   their runtime representation will have an extra property "type"
 */
const allLinksSelector = createSelector(
  linksSelector,
  wikiLinksSelector,
  (links, wikiLinks) =>
    [
      /*
         user links should show before wiki links
         as they might be more prefered or related to
         what they are doing.
      */
      ...links.map(l => ({...l, type: 'custom'})),
      ...wikiLinks.map(l => ({...l, type: 'preset'})),
    ]
)

export { allLinksSelector }
