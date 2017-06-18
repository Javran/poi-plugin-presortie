import { CheckMethod } from './common'

import { AllSlotsEmpty } from './all-slots-empty'
import { FastFleet } from './fast-fleet'
import { AACI } from './aaci'
import { OASW } from './oasw'
import { CountSaiun } from './count-saiun'
import { HasRadar } from './has-radar'
import { FighterPower } from './fighter-power'
import { Health } from './health'

// TODO: need more time to think about "health" and "resupply"

const Checkers = {}
// for a fixed checker ordering
const checkerList = []

const registerChecker = checker => {
  Checkers[checker.name] = checker
  Checkers[checker.type] = checker
  checkerList.push(checker)
}

[
  AllSlotsEmpty,
  FastFleet,
  AACI,
  OASW,
  HasRadar,
  CountSaiun,
  FighterPower,
  Health,
].map(registerChecker)

export {
  CheckMethod,

  Checkers,
  checkerList,
}
