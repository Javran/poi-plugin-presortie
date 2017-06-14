import { AllSlotsEmptyEdit } from './all-slots-empty-edit'
import { FastFleetEdit } from './fast-fleet-edit'
import { AACIEdit } from './aaci-edit'
import { OASWEdit } from './oasw-edit'
import { HasSaiunEdit } from './has-saiun-edit'
import { HasRadarEdit } from './has-radar-edit'
import { FighterPowerEdit } from './fighter-power-edit'

import { Checkers, checkerList } from '../../../structs'

// collection of editor initial states
const initEditorStates = {}
checkerList.map(checkerClass => {
  initEditorStates[checkerClass.type] = checkerClass.defValue
})

// this is the corresponding UI of checkers
const checkerExtras = {}

const registerCheckerExtra = (type, editor, viewer) => {
  const checker = Checkers[type]
  checkerExtras[type] = {
    type,
    checker,
    editor,
    viewer,
  }
}

// TODO: viewers

registerCheckerExtra('all-slots-empty', AllSlotsEmptyEdit)
registerCheckerExtra('fast-fleet', FastFleetEdit)
registerCheckerExtra('aaci', AACIEdit)
registerCheckerExtra('oasw', OASWEdit)
registerCheckerExtra('has-saiun', HasSaiunEdit)
registerCheckerExtra('has-radar', HasRadarEdit)
registerCheckerExtra('fighter-power', FighterPowerEdit)

export {
  checkerExtras,
  initEditorStates,
}
