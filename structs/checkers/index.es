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
import { Morale } from './morale'
import { LoS } from './los'
import { ExtraSlots } from './extra-slots'
import { YasenEquips } from './yasen-equips'

const Checkers = {}
// for a fixed checker ordering
const checkerList = []

const registerChecker = checker => {
  Checkers[checker.name] = checker
  Checkers[checker.type] = checker
  checkerList.push(checker)
}

/*
   the following is a list of "checker classes", which defines
   checker data representation and how it should be interpreted.
   every checker class has the following static fields:

   - type: string. what identifies this checker class / its data representation
     from other classes

   - defValue: the default data representation without "id", "enabled" and "type" fields
     (we also call data with no guarantee about existency of these fields "partial checker")

   - title: string. what appears on UI as a simple description of what this checker does

   - isValid(obj): for helping input validation, should return a boolean indicating
     whether `obj` is a valid checker data representation.
     (TODO: isValid => isValidInput)

   - (TODO) isValidTarget: check "fleet" field (or "target" in future) to see if current
     checker supports it

   - describe(obj): (optional) returns a string that describes a valid `obj` data representation.
     if this method is missing, `JSON.stringify` will be used.

   - prepare(obj)(checkerContext): (optional) returns an array of problems this checker has found.

     this function is a bit complicated, let's break it into two parts:

       - prepare(obj) returns a function, which we call "listProblems".

       - listProblems(checkerContext) does the actual check, and return a list of problems
         it has found - so returning an empty array means checker has found no problem.

       - note that some structure can be pre-processed before knowing `checkerContext`,
         for example a `CheckMethod` can be turned into a function, we can do such thing
         in `prepare(obj)`, which constructs a function for accepting different `checkerContext`
         without having to do these pre-processing twice (given that data representation doesn't
         change)

       - `checkerContext` is a slice of the poi store plus some extra information:

           - property `const` and `info` comes from poi store, so most of the selectors
             can be used directly on `checkerContext` as if it's a poi main state.
             (keep in mind that it only contains these two properties so if the selector
             is accessing other parts there will be a problem)

           - `memoId` and `fleetId` represents what user has chosen
             for this plugin to check against.

     when leaving this method not implemented, the checker on UI will always be unsatisfied
     with problem being something like `checker not prepared`
 */

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
  Morale,
  LoS,
  ExtraSlots,
  YasenEquips,
].map(registerChecker)

export {
  CheckMethod,

  Checkers,
  checkerList,
}
