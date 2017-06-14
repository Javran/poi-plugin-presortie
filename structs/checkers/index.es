import { AllSlotsEmpty } from './all-slots-empty'
import { FastFleet } from './fast-fleet'

const Checkers = {}
// for a fixed checker ordering
const checkerList = []

const registerChecker = checker => {
  Checkers[checker.name] = checker
  checkerList.push(checker)
}

registerChecker(AllSlotsEmpty)
registerChecker(FastFleet)

export {
  Checkers,
  checkerList,
}
