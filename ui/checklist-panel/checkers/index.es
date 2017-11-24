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

   - every checker will have a view state "value" and edit state "editorState"

       - view state is just the actual value of the checker

       - edit state is only used when a checker is being edited
         or we are in the middle of creating a new one.
         for the latter we might not have "type", "target" and "enabled" ready,
         which is referred to as "partial checkers"

   - every checker will declare its own "checker type" and it's up to
     "registerCheckerUi" to do the right thing

   - toEditorState(<value>) : editorState

   - fromEditorState(<editorState>) : value or null, where "null" stands for failure

     note that "fromEditorState" is only responsible for making sure we get
     the structure right from user input, but logical parts will be checked by
     the mechanism: "<Checker>.isValidObj" will be invoked in resulting value
     to see if the checker object is really valid.

     for example, if we want user to input some number less than 100,
     then "fromEditorState" only makes sure to convert from raw input to
     numbers, and the logical check that the number is indeed less than 100
     is the job of "<Checker>.isValidObj".

 */

// collection of editor initial states
const initEditorStates = {}
checkerList.map(checkerClass => {
  initEditorStates[checkerClass.type] = checkerClass.defValue
})

// this is the corresponding UI of checkers
const CheckerUis = {}

const isWIPChecker = CheckerEditor => {
  if (typeof CheckerEditor.toEditorState !== 'function') {
    return true
  }

  if (typeof CheckerEditor.fromEditorState !== 'function') {
    return true
  }

  return false
}

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

const registerCheckerUi = (Editor, viewerOrNull=null) => {
  const {checkerType} = Editor
  if (!checkerType || typeof checkerType !== 'string') {
    console.warn(
      `invalid editor ${Editor}, which has unexpected checkerType: ${checkerType}, skipping`
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

  const Viewer = viewerOrNull || mkViewer(checkerType)

  CheckerUis[checkerType] = {
    type: checkerType,
    checker,
    Editor,
    Viewer,
  }
}

/*
   TODO: fromEditorState / toEditorState

   - HealthEdit
   - ResupplyEdit
   - MoraleEdit
   - LoSEdit
   - ExtraSlotsEdit
   - YasenEquipsEdit

 */

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
  isWIPChecker,
}
