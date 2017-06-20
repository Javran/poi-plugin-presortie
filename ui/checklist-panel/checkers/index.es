import React from 'react'

import { PTyp } from '../../../ptyp'

import { AllSlotsEmptyEdit } from './all-slots-empty-edit'
import { FastFleetEdit } from './fast-fleet-edit'
import { AACIEdit } from './aaci-edit'
import { OASWEdit } from './oasw-edit'
import { HasRadarEdit } from './has-radar-edit'
import { CountSaiunEdit } from './count-saiun-edit'
import { FighterPowerEdit } from './fighter-power-edit'
import { HealthEdit } from './health-edit'
import { ResupplyEdit } from './resupply-edit'
import { LoSEdit } from './los-edit'
import { ExtraSlotsEdit } from './extra-slots-edit'
import { YasenEquipsEdit } from './yasen-equips-edit'

import { Checkers, checkerList } from '../../../structs'

// collection of editor initial states
const initEditorStates = {}
checkerList.map(checkerClass => {
  initEditorStates[checkerClass.type] = checkerClass.defValue
})

// this is the corresponding UI of checkers
const checkerExtras = {}

const mkViewer = type => {
  const checkerClass = Checkers[type]

  const component = props => {
    const {checker, style} = props
    const description =
      typeof checkerClass.describe === 'function' ?
        checkerClass.describe(checker) :
        JSON.stringify(checker)
    return (
      <div style={style}>
        {description}
      </div>
    )
  }

  component.propTypes = {
    checker: PTyp.object.isRequired,
    style: PTyp.object,
  }

  component.defaultProps = {
    style: {},
  }

  return component
}

const registerCheckerExtra = (type, editor) => {
  const checker = Checkers[type]
  checkerExtras[type] = {
    type,
    checker,
    editor,
    viewer: mkViewer(type),
  }
}

registerCheckerExtra('all-slots-empty', AllSlotsEmptyEdit)
registerCheckerExtra('fast-fleet', FastFleetEdit)
registerCheckerExtra('aaci', AACIEdit)
registerCheckerExtra('oasw', OASWEdit)
registerCheckerExtra('has-radar', HasRadarEdit)
registerCheckerExtra('count-saiun', CountSaiunEdit)
registerCheckerExtra('fighter-power', FighterPowerEdit)
registerCheckerExtra('health', HealthEdit)
registerCheckerExtra('resupply', ResupplyEdit)
registerCheckerExtra('los', LoSEdit)
registerCheckerExtra('extra-slots', ExtraSlotsEdit)
registerCheckerExtra('yasen-equips', YasenEquipsEdit)

export {
  checkerExtras,
  initEditorStates,
}
