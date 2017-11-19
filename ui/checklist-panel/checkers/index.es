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
import { MoraleEdit } from './morale-edit'
import { LoSEdit } from './los-edit'
import { ExtraSlotsEdit } from './extra-slots-edit'
import { YasenEquipsEdit } from './yasen-equips-edit'

import { Checkers, checkerList, Target } from '../../../structs'

/*
   TODO: refactoring plan:

   - every checker will have a view state "value" and edit state "editorState"

   - every checker will declare its own "checker type" and it's up to
     "registerCheckerExtra" to dispatch them properly

   - view state is just the actual value of the checker
   - edit state is only used when a checker is being edited
     or we are in the middle of creating a new one

   - toEditorState(<value>) : editorState

   - fromEditorState(<editorState>) : value or null, where "null" stands for failure

 */

// collection of editor initial states
const initEditorStates = {}
checkerList.map(checkerClass => {
  initEditorStates[checkerClass.type] = checkerClass.defValue
})

// this is the corresponding UI of checkers
const CheckerUis = {}

const mkViewer = type => {
  const CheckerClass = Checkers[type]

  const component = props => {
    const {checker, style} = props

    let description
    if (typeof CheckerClass.describe === 'function') {
      description = CheckerClass.describe(checker)
    } else {
      console.warn(`Checker of type ${type} is missing .describe function`)
      description = JSON.stringify(checker)
    }

    return (
      <div style={style}>
        <div style={{fontSize: '80%'}}>
          {Target.toString(checker.target)}
        </div>
        <div>
          {description}
        </div>
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

const registerCheckerUi = (editor, viewerOrNull=null) => {
  const {checkerType} = editor
  if (!checkerType || typeof checkerType !== 'string') {
    console.warn(
      `invalid editor ${editor}, which has unexpected checkerType: ${checkerType}, skipping`
    )
    return
  }

  const checker = Checkers[checkerType]
  if (!checker) {
    console.warn(`unknown checker for type ${checkerType}`)
    return
  }

  if (checkerType in CheckerUis) {
    console.warn(`overwriting existing CheckerUis entry: ${checkerType}`)
  }

  const viewer = viewerOrNull || mkViewer(checkerType)

  CheckerUis[checkerType] = {
    type: checkerType,
    checker,
    editor,
    viewer,
  }
}

[
  AllSlotsEmptyEdit,
  FastFleetEdit,
  AACIEdit,
  OASWEdit,
  HasRadarEdit,
  CountSaiunEdit,
  FighterPowerEdit,
  HealthEdit,
  ResupplyEdit,
  MoraleEdit,
  LoSEdit,
  ExtraSlotsEdit,
  YasenEquipsEdit,
].map(args => {
  if (Array.isArray(args)) {
    const [editor, viewer] = args
    return registerCheckerUi(editor, viewer)
  } else {
    const editor = args
    return registerCheckerUi(editor, null)
  }
})

export {
  CheckerUis,
  initEditorStates,
}
