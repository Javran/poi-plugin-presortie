/*
   this reducer maintains states that requires loading before
   it can accept modifying actions.
 */
import { mkSimpleReducer, modifyObject } from 'subtender'
import { emptyMemo } from '../structs'

const tyMod = '@poi-plugin-presortie@persist@Modify'
const tyRdy = '@poi-plugin-presortie@persist@Ready'

const initState = {
  /*
     current fleet id, taking value 1-4.
     note that when it's a combined fleet,
     fleet #1 will no longer be usable as a seperated one,
     so `fleetId === 1` also stands for a combined fleet
     when the combined flag is set.
   */
  fleetId: 1,
  /*
     user selected map could be one of the following:

     - {type: 'id', mapId: <number>}
     - {type: 'last'}: select map id of last sortie

   */
  selectedMap: {type: 'last'},
  /*
     an Object of:
     - key: <mapId>
     - value: {checklist, notes, links}
   */
  mapMemos: {},
  /*
     a ready flag will be present
     once the reducer takes over.
   */
  // ready: <bool>,
}

const reducer = mkSimpleReducer(initState, tyMod, tyRdy)

const actionCreator = {
  persistReady: newState => ({
    type: tyRdy,
    newState,
  }),
  persistModify: modifier => ({
    type: tyMod,
    modifier,
  }),
  fleetIdChange: fleetId =>
    actionCreator.persistModify(
      modifyObject('fleetId', () => fleetId)
    ),
  selectedMapChange: selectedMap =>
    actionCreator.persistModify(
      modifyObject('selectedMap', () => selectedMap)
    ),
  mapMemosModify: modifier =>
    actionCreator.persistModify(
      modifyObject('mapMemos', modifier)
    ),
  mapMemoModify: (mapId, modifier) =>
    actionCreator.mapMemosModify(
      modifyObject(
        mapId,
        // provide an empty memo so modifiers don't
        // have to worry about it.
        (memo=emptyMemo) => modifier(memo)
      )
    ),
}

export {
  reducer,
  actionCreator,
}
