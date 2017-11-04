import React, { Component } from 'react'
import {
  Button,
  DropdownButton, MenuItem,
  ButtonGroup,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { checkerExtras } from './checkers'

import { PTyp } from '../../ptyp'
import { Checkers, checkerList } from '../../structs'

/*
   collection of editor initial states.

   TODO: it's unnecessary to limit editor states to just be valid values,
   we should have mechanism to:
   (1) expand a value into some editor state
   (2) get back valid values through input validation
 */
const initEditorStates = {}
checkerList.map(checkerClass => {
  initEditorStates[checkerClass.type] = checkerClass.defValue
})

const targetToText = target => {
  const fleetMatch = /^fleet-(\d+)$/.exec(target)
  if (fleetMatch) {
    const [_ignored, fleetIdStr] = fleetMatch
    return `Fleet #${fleetIdStr}`
  }

  return target
}

const checkerControlPairs = checkerList.map(checker => [
  checker.type, checkerExtras[checker.type].editor])

class AddCheckerPanel extends Component {
  static propTypes = {
    onAddChecker: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      editor: 'los',
      target: 'fleet-1',
      editorStates: initEditorStates,
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
    onAddChecker({
      ...partialChecker,
      type: editor,
    })
    this.handleReset()
  }

  handleSwitchEditor = editor =>
    this.setState({ editor })

  handleSelectTarget = target =>
    this.setState({target})

  render() {
    const {editor, editorStates} = this.state
    const editorState = editorStates[editor]
    const checker = Checkers[editor]
    const isInputValid = checker.isValid(editorState)
    return (
      <div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{width: '60%', marginRight: '.2em'}}>
            <ButtonGroup justified>
              <DropdownButton
                title={Checkers[editor].title}
                onSelect={this.handleSwitchEditor}
                id="presortie-add-checker-checker-dropdown">
                {
                  checkerList.map(checkerClass => (
                    <MenuItem key={checkerClass.type} eventKey={checkerClass.type}>
                      {checkerClass.title}
                    </MenuItem>
                  ))
                }
              </DropdownButton>
            </ButtonGroup>
          </div>
          <div style={{width: '40%', marginLeft: '.2em'}}>
            <ButtonGroup justified>
              <DropdownButton
                title={targetToText(this.state.target)}
                onSelect={this.handleSelectTarget}
                id="presortie-add-checker-target-dropdown">
                {
                  [1,2,3,4].map(fleetId => {
                    const target = `fleet-${fleetId}`
                    return (
                      <MenuItem
                        key={target} eventKey={target}
                      >
                        {targetToText(target)}
                      </MenuItem>
                    )
                  })
                }
              </DropdownButton>
            </ButtonGroup>
          </div>
        </div>
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
            style={{marginLeft: 5, width: '2.7em'}}
            bsSize="small"
            onClick={this.handleReset}
          >
            <FontAwesome name="close" />
          </Button>
          <Button
            disabled={!isInputValid}
            bsStyle={isInputValid ? 'default' : 'danger'}
            style={{marginLeft: 5, width: '2.7em'}}
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
