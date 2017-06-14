import React, { Component } from 'react'
import {
  Button,
  DropdownButton, MenuItem,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { AllSlotsEmptyEdit } from './checkers/all-slots-empty-edit'
import { FastFleetEdit } from './checkers/fast-fleet-edit'

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
]

/*

   TODO:

   - fast-fleet
   - aaci
   - oasw
   - has-saiun
   - has-radar
   - fighter-power
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
    const {editor} = this.state
    return (
      <div>
        <DropdownButton
          title={editor}
          onSelect={this.handleSwitchEditor}
          id="presortie-add-checker-dropdown">
          {
            checkerList.map(checkerClass => (
              <MenuItem key={checkerClass.type} eventKey={checkerClass.type}>
                {checkerClass.type}
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
