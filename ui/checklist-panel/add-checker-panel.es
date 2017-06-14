import React, { Component } from 'react'
import {
  Button,
  DropdownButton, MenuItem,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { AllSlotsEmptyEdit } from './checkers/all-slots-empty-edit'
import { FastFleetEdit } from './checkers/fast-fleet-edit'
import { AACIEdit } from './checkers/aaci-edit'
import { OASWEdit } from './checkers/oasw-edit'
import { HasSaiunEdit } from './checkers/has-saiun-edit'
import { HasRadarEdit } from './checkers/has-radar-edit'
import { FighterPowerEdit } from './checkers/fighter-power-edit'

import { PTyp } from '../../ptyp'
import { Checkers, checkerList } from '../../structs'

// collection of editor initial states
const initEditorStates = {}
checkerList.map(checkerClass => {
  initEditorStates[checkerClass.type] = checkerClass.defValue
})

const checkerControlPairs = [
  ['all-slots-empty', AllSlotsEmptyEdit],
  ['fast-fleet', FastFleetEdit],
  ['aaci', AACIEdit],
  ['oasw', OASWEdit],
  ['has-saiun', HasSaiunEdit],
  ['has-radar', HasRadarEdit],
  ['fighter-power', FighterPowerEdit],
]

/*

   TODO:

   - resupply
   - health

 */

class AddCheckerPanel extends Component {
  static propTypes = {
    onAddChecker: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      editor: 'all-slots-empty',
      editorStates: initEditorStates,

      allSlotsEmpty: Checkers.AllSlotsEmpty.defValue,
      fastFleet: Checkers.FastFleet.defValue,
    }
  }

  handleModifyValue = editor => modifier => {
    const { editorStates } = this.state
    this.setState({
      editorStates: {
        ...editorStates,
        [editor]: modifier(editorStates[editor]),
      },
    })
  }

  handleReset = () => {
    const { editor } = this.state
    this.handleModifyValue(editor)(() => initEditorStates[editor])
  }

  handleAddChecker = () => {
    const { editor, editorStates } = this.state
    const partialChecker = editorStates[editor]
    const { onAddChecker } = this.props
    onAddChecker(partialChecker)
    this.handleReset()
  }

  handleSwitchEditor = editor =>
    this.setState({ editor })

  render() {
    const {editor, editorStates} = this.state
    const editorState = editorStates[editor]
    const checker = Checkers[editor]
    const isInputValid = checker.isValid(editorState)
    return (
      <div>
        <DropdownButton
          title={Checkers[editor].title}
          onSelect={this.handleSwitchEditor}
          id="presortie-add-checker-dropdown">
          {
            checkerList.map(checkerClass => (
              <MenuItem key={checkerClass.type} eventKey={checkerClass.type}>
                {checkerClass.title}
              </MenuItem>
            ))
          }
        </DropdownButton>
        <div style={{display: 'flex', alignItems: 'flex-end'}}>
          <div style={{flex: 1}}>
            {
              checkerControlPairs.map(([checkerType, CheckerEditor]) => (
                <CheckerEditor
                  key={checkerType}
                  style={editor === checkerType ? {} : {display: 'none'}}
                  value={this.state.editorStates[checkerType]}
                  onModifyValue={this.handleModifyValue(checkerType)}
                />
              ))
            }
          </div>
          <Button
            style={{marginLeft: 5, height: 'auto'}}
            bsSize="small"
            onClick={this.handleReset}
          >
            <FontAwesome name="undo" />
          </Button>
          <Button
            disabled={!isInputValid}
            bsStyle={isInputValid ? 'default' : 'danger'}
            style={{marginLeft: 5, height: 'auto'}}
            bsSize="small"
            onClick={this.handleAddChecker}
          >
            <FontAwesome name="plus" />
          </Button>
        </div>
      </div>
    )
  }
}

export {
  AddCheckerPanel,
}
