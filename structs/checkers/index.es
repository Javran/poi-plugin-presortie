import { CheckMethod } from './common'

import { AllSlotsEmpty } from './all-slots-empty'
import { FastFleet } from './fast-fleet'
import { AACI } from './aaci'
import { OASW } from './oasw'
import { CountSaiun } from './count-saiun'
import { HasRadar } from './has-radar'
import { FighterPower } from './fighter-power'
import { Health } from './health'
import { Resupply } from './resupply'
import { LoS } from './los'
import { ExtraSlots } from './extra-slots'
import { YasenEquips } from './yasen-equips'

const Checkers = {}
// for a fixed checker ordering
const checkerList = []

/*

   2 extra checkers:

   - extra-slots: make sure if extra slot is filled if it's available
   - yasen-equips: make sure yasen(night battle)-related equipments are equipped

 */

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
  Resupply,
  LoS,
  ExtraSlots,
  YasenEquips,
].map(registerChecker)

export {
  CheckMethod,

  Checkers,
  checkerList,
}
