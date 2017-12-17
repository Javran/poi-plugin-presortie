import _ from 'lodash'

import { CheckMethod } from './common'
import { Target } from '../target'
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

// Checkers[<string>] gets a checker class
const Checkers = {}
// an Array just for keeping a consistent checker ordering
const checkerList = []

const registerChecker = checker => {
  const assertTy = (propName, tyStr) => {
    if (! (propName in checker)) {
      console.warn(`Checker ${checker} is missing property ${propName}`)
      return
    }
    // eslint-disable-next-line valid-typeof
    if (typeof checker[propName] !== tyStr) {
      console.warn(`Checker ${checker}: property ${propName} does not have type ${tyStr}`)
      return
    }
    // for stopping eslint from being smart
    _.noop()
  }

  assertTy('type', 'string')
  assertTy('defValue', 'object')
  assertTy('title', 'string')
  assertTy('isValidObj', 'function')
  assertTy('describe', 'function')
  assertTy('prepare', 'function')
  // TODO: WIP
  assertTy('isValidTarget', 'function')
  if (!checker.isValidTarget) {
    // TODO
    // eslint-disable-next-line no-param-reassign
    checker.isValidTarget = (t => Target.getType(t) === 'fleet')
  }

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

   - defValue: the default data representation without the following fields:

     - "id"
     - "enabled"
     - "type"
     - "target"

     (we also call data with no guarantee about existency of these fields "partial checker")

   - title: string. what appears on UI as a simple description of what this checker does

   - isValidObj(obj): for helping input validation, should return a boolean indicating
     whether `obj` is a valid checker data representation.

   - isValidTarget: check "target" field to see if current checker supports it

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

           - `memoId` represents memo focus.

     when leaving this method not implemented, the checker on UI will always be unsatisfied
     with problem being something like `checker not prepared`
 */

/*
   TODO: impl isValidTarget && extend to support targets other than "fleet-X"

   - HasRadar: extend to combined
   - CountSaiun: extend to combined
   - FighterPower: extend to combined
   - Health: extend to combined
   - Resupply: extend to combined
   - Morale: extend to combined
   - LoS: extend to combined
   - ExtraSlots: extend to combined

   TODO: generalze some rules, reduce rule set.

   - CountSaiun & YasenEquips & HasRadar can be expressed using a more generalized check:

       (draft)

       - countTarget: number of fleet members that has it vs. number of equipments in total
       - targetEquip: Array of [<equip type requirement> or <equip set requirement>]

         - connective: or
         - equip type requirement: a set of api_type[2]
         - equip set requirement: a set of slotitem id

       - checkMethod

       - then we can make them presets:

         CountSaiun:
         - countTarget: number of equips
         - targetEquip: [<two different saiuns>]
         - checkMethod: greater than 0

         YasenEquips: similar, but might break into multiple parts

         HasRadar:
         - countTarget: number of fleet members that has it
         - targetEquip: any radar type will do
         - checkMethod: greater or equal to 3

         then we can encode drum requirements as well.

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
