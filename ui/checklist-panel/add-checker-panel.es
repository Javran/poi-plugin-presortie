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
    targetInfoList: PTyp.array.isRequired,
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

  getCheckerClass = () =>
    Checkers[this.state.curType]

  getValidPartialChecker = () => {
    const {curType, editorStates} = this.state
    const editorState = editorStates[curType]
    const checker = this.getCheckerClass()
    const {Editor} = CheckerUis[curType]
    const partialChecker = Editor.fromEditorState(editorState)
    if (partialChecker && checker.isValidObj(partialChecker)) {
      return partialChecker
    } else {
      return null
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
    const checkerClass = this.getCheckerClass()

    if (partialChecker && checkerClass.isValidTarget(target)) {
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
    curType !== 'internal/wip' &&
    this.setState({curType})

  handleSelectTarget = target =>
    this.setState({target})

  render() {
    const {curType, target: curTarget} = this.state
    const {targetInfoList} = this.props
    const curCheckerClass = this.getCheckerClass()
    const isInputValid =
      Boolean(this.getValidPartialChecker()) &&
      curCheckerClass.isValidTarget(curTarget)
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
                          eventKey="internal/wip"
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
                  targetInfoList.map(targetOrSep => {
                    if (typeof targetOrSep === 'string') {
                      return (<MenuItem divider key={targetOrSep} />)
                    } else {
                      const {target, available} = targetOrSep
                      return (
                        <MenuItem
                          key={target} eventKey={target}
                        >
                          <div className={available ? 'text-primary' : 'text-muted'}>
                            {Target.toString(target)}
                          </div>
                        </MenuItem>
                      )
                    }
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
