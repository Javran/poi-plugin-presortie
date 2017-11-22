import _ from 'lodash'
import { modifyObject } from 'subtender'
import React, { Component } from 'react'
import {
  Button,
  DropdownButton, MenuItem,
  ButtonGroup,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { CheckerUis, isWIPChecker } from './checkers'

import { PTyp } from '../../ptyp'
import { Checkers, checkerList, Target } from '../../structs'

/*
   collection of editor initial states.

   TODO: it's unnecessary to limit editor states to just be valid values,
   we should have mechanism to:
   (1) expand a value into some editor state
   (2) get back valid values through input validation
 */
const initEditorStates = {}
let initFocus = null
checkerList.map(checkerClass => {
  const {type} = checkerClass
  const {Editor} = CheckerUis[type]
  if (!isWIPChecker(Editor)) {
    if (!initFocus)
      initFocus = type
    initEditorStates[type] =
      Editor.toEditorState(checkerClass.defValue)
  }
})

const checkerControlPairs = checkerList.map(checker => [
  checker.type, CheckerUis[checker.type].Editor])

const warnOnce = _.memoize(typ =>
  console.warn(`editor for type ${typ} is still WIP`)
)

class AddCheckerPanel extends Component {
  static propTypes = {
    onAddChecker: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      curType: initFocus,
      target: 'fleet-1',
      editorStates: initEditorStates,
    }
  }

  handleModifyValue = type => modifier =>
    this.setState(
      modifyObject(
        'editorStates',
        modifyObject(type,modifier)
      )
    )

  handleReset = () => {
    const {curType} = this.state
    this.handleModifyValue(curType)(() => initEditorStates[curType])
  }

  handleAddChecker = () => {
    const {curType, target} = this.state
    const partialChecker = this.getValidPartialChecker()

    if (partialChecker) {
      const {onAddChecker} = this.props
      onAddChecker({
        ...partialChecker,
        type: curType,
        target,
      })
    } else {
      console.warn('trying to add an invalid checker, skipping...')
    }
    this.handleReset()
  }

  handleSwitchCurType = curType =>
    curType !== "wip" &&
    this.setState({curType})

  handleSelectTarget = target =>
    this.setState({target})

  getValidPartialChecker = () => {
    const {curType, editorStates} = this.state
    const editorState = editorStates[curType]
    const checker = Checkers[curType]
    const {Editor} = CheckerUis[curType]
    const partialChecker = Editor.fromEditorState(editorState)
    if (partialChecker && checker.isValidObj(partialChecker)) {
      return partialChecker
    } else {
      return null
    }
  }

  render() {
    const {curType} = this.state
    const isInputValid = Boolean(this.getValidPartialChecker())
    return (
      <div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{width: '60%', marginRight: '.2em'}}>
            <ButtonGroup justified>
              <DropdownButton
                title={Checkers[curType].title}
                onSelect={this.handleSwitchCurType}
                id="presortie-add-checker-checker-dropdown">
                {
                  checkerList.map(checkerClass => {
                    const checkerUi = CheckerUis[checkerClass.type]
                    if (isWIPChecker(checkerUi.Editor)) {
                      warnOnce(checkerClass.type)
                      return (
                        <MenuItem
                          key={checkerClass.type}
                          eventKey={/* TODO: remove after done */ "wip"}
                        >
                          Checker WIP: {checkerClass.type}
                        </MenuItem>
                      )
                    }

                    return (
                      <MenuItem
                        key={checkerClass.type}
                        eventKey={checkerClass.type}
                      >
                        {checkerClass.title}
                      </MenuItem>
                    )
                  })
                }
              </DropdownButton>
            </ButtonGroup>
          </div>
          <div style={{width: '40%', marginLeft: '.2em'}}>
            <ButtonGroup justified>
              <DropdownButton
                title={Target.toString(this.state.target)}
                onSelect={this.handleSelectTarget}
                id="presortie-add-checker-target-dropdown">
                {
                  [1,2,3,4].map(fleetId => {
                    const target = `fleet-${fleetId}`
                    return (
                      <MenuItem
                        key={target} eventKey={target}
                      >
                        {Target.toString(target)}
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
                this.state.editorStates[checkerType] ? (
                  <CheckerEditor
                    key={checkerType}
                    style={curType === checkerType ? {} : {display: 'none'}}
                    value={this.state.editorStates[checkerType]}
                    onModifyValue={this.handleModifyValue(checkerType)}
                  />
                ) : (
                  <div
                    key={checkerType}
                    style={curType === checkerType ? {} : {display: 'none'}}
                  >
                    Checker Editor not available for type {checkerType}
                  </div>
                )
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
