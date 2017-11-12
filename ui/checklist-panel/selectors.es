import { createSelector } from 'reselect'

import {
  stateSelector,
} from 'views/utils/selectors'

import {
  memoFocusSelector,
  checklistSelector,
} from '../../selectors'

import { Checkers } from '../../structs/checkers'

const enabledCheckersSelector = createSelector(
  checklistSelector,
  cl => cl.filter(c => c.enabled)
)

// a checker context is an Object that stores enough info
// for checkers to do what they are supposed to do.
// this module stores related functions
const checkerContextSelector = createSelector(
  memoFocusSelector,
  stateSelector,
  (memoId, st) => ({
    memoId,
    // "const" and "info" come directly from the store,
    // so CheckerContext will have exactly the same shape
    // as the store (given only these two fields are accessed,
    // which should be a reasonable assumption)
    // This allows reusing selectors as functions.
    const: st.const,
    info: st.info,
  })
)

// a preparedChecker has an extra field "listProblems",
// which is a function that returns a list of problems
// when CheckerContext is applied to it
const preparedCheckersSelector = createSelector(
  enabledCheckersSelector,
  checklist => checklist.map(checker => {
    const checkerClass = Checkers[checker.type]
    let listProblems
    if (typeof checkerClass.prepare === 'function') {
      listProblems = checkerClass.prepare(checker)
    } else {
      console.error(`checker of type ${checker.type} does not have a prepare method`)
      listProblems = () => ["Checker not prepared"]
    }
    return {
      ...checker,
      listProblems,
    }
  }))

const checkerResultsSelector = createSelector(
  preparedCheckersSelector,
  checkerContextSelector,
  (preparedCheckers, checkerContext) =>
    preparedCheckers.map(preparedChecker => ({
      ...preparedChecker,
      problems: preparedChecker.listProblems(checkerContext),
    })))

const checkerResultsMapSelector = createSelector(
  checkerResultsSelector,
  checkerResults => checkerResults.reduce(
    (acc,checker) => ({...acc, [checker.id]: checker}),
    {}))

const checklistUISelector = createSelector(
  checkerResultsMapSelector,
  checkerResultsMap =>
    ({checkerResultsMap}))

export { checklistUISelector }
