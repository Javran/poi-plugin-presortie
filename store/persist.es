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
     userPreferredMemoFocus is either 'last', or MemoId (see below).
     the idea is that:
     - if it's MemoId, we simply use that as the effective memo focus.
     - if it's 'last', we take the latest sortied map as the focus,
       and when this is not possible (either because the map no longer exists or
       we simply don't have a history), the effective memo focus falls back to 'general'.
   */
  userPreferredMemoFocus: 'last',
  /*
     the following feature is enabled when smartMemoFocus === true:
     when "userPreferredMemoFocus" is a particular map (not 'last' or 'general' but a number),
     and player sorties to that map, "userPreferredMemoFocus" is automatically switched to 'last'.
     This is useful in case where user wants to plan ahead of going to sortie page
     but still want the focus to be interpreted dynamically (using 'last') afterwards.
   */
  smartMemoFocus: true,
  /*
     an Object of:
     - key: <MemoId>
     - value: {checklist, notes, links}

     a MemoId is a string equal to either of the following
     - string 'general'
     - String(mapId)
   */
  memos: {},
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
  userPreferredMemoFocusChange: lastOrMemoId =>
    actionCreator.persistModify(
      modifyObject('userPreferredMemoFocus', () => lastOrMemoId)
    ),
  memosModify: modifier =>
    actionCreator.persistModify(
      modifyObject('memos', modifier)
    ),
  memoModify: (memoId, modifier) =>
    actionCreator.memosModify(
      modifyObject(
        memoId,
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
