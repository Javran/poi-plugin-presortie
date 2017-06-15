import React from 'react'

import { PTyp } from '../../../ptyp'

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
registerCheckerExtra('has-saiun', HasSaiunEdit)
registerCheckerExtra('has-radar', HasRadarEdit)
registerCheckerExtra('fighter-power', FighterPowerEdit)

export {
  checkerExtras,
  initEditorStates,
}
