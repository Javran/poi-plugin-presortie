import _ from 'lodash'
import { mkSimpleReducer } from 'subtender'

/*

   sortie history is an Array of mapIds (e.g. 11, 54, 391)
   sorted by last sortie time.

   - the most recent one is the first
   - every element should be unique

 */
const initState = []

// modify action type
const tyMod = '@poi-plugin-presortie@sortieHistory@Modify'

const reducer = mkSimpleReducer(initState, tyMod)

const actionCreator = {
  sortieHistoryModify: modifier => ({
    type: tyMod,
    modifier,
  }),
  // record new mapId to sortie history
  sortieHistoryAdd: mapId =>
    actionCreator.sortieHistoryModify(
      sh => [mapId, ...sh.filter(x => x !== mapId)]
    ),
  // merge old sortie history with the current one
  sortieHistoryMergeOld: oldSH =>
    actionCreator.sortieHistoryModify(
      oldSH.length === 0 ?
        // NOOP if there's nothing to be added
        _.identity :
        sh => _.uniq([...sh, ...oldSH])
    ),
}

export {
  reducer,
  actionCreator,
}
