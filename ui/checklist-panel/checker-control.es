import React, { Component } from 'react'
import {
  Button,
  OverlayTrigger, Tooltip,
  DropdownButton, MenuItem,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { modifyObject } from 'subtender'

import { PTyp } from '../../ptyp'
import { CheckerUis, isWIPChecker } from './checkers'
import { Target, Checkers } from '../../structs'

/*
   props.checker: actual checker value
   state.editorState: null (iff. not editing) or an editor state
   therefore state.editorState === null indicates view mode
 */
class CheckerControl extends Component {
  static propTypes = {
    checker: PTyp.object.isRequired,
    memoFocus: PTyp.string.isRequired,
    problems: PTyp.array.isRequired,
    onModifyChecker: PTyp.func.isRequired,
    onRemoveChecker: PTyp.func.isRequired,
    onToggleChecker: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {editorState: null}
  }

  getEditor = () =>
    CheckerUis[this.props.checker.type].Editor

  getValidCheckerFromState = () => {
    if (this.state.editorState === null)
      return null
    const Editor = this.getEditor()
    const checker = Editor.fromEditorState(this.state.editorState)
    if (!checker)
      return null
    const {type} = this.props.checker
    const Checker = Checkers[type]
    return Checker.isValidObj(checker) ? checker : null
  }

  handleStartEditing = () => {
    const Editor = this.getEditor()
    this.setState({
      editorState: Editor.toEditorState(this.props.checker),
    })
  }

  handleCancelEditing = () =>
    this.setState({editorState: null})

  handleSaveChecker = () => {
    const checker = this.getValidCheckerFromState()
    if (checker) {
      const {onModifyChecker} = this.props
      onModifyChecker(() => checker)
      this.setState({editorState: null})
    } else {
      console.error(`inconsistent: trying to save an invalid editor state`)
    }
  }

  handleSelectTarget = target =>
    this.setState(
      modifyObject(
        'editorState',
        modifyObject('target', () => target)
      )
    )

  renderViewMode() {
    const { checker, problems, onToggleChecker } = this.props
    const { type, enabled } = checker
    const checkerExtra = CheckerUis[type]
    const satisfied = problems.length === 0
    const tooltip = (
      <Tooltip
        className="presortie-checker-tooltip"
        id={`presortie-tooltip-checker-${checker.id}`}>
        <div key="toggle-hint">Click to {enabled ? 'disable' : 'enable'}</div>
        {
          problems.map( (problem,ind) => (
            <div key={
              // eslint-disable-next-line react/no-array-index-key
              ind
            }>{problem}</div>
          ))
        }
      </Tooltip>
    )
    return (
      <div style={{display: 'flex', alignItems: 'flex-end'}}>
        <div style={{flex: 1}}>
          <checkerExtra.Viewer
            checker={checker}
          />
        </div>
        <Button
          style={{marginLeft: 5, width: '2.7em'}}
          bsSize="small"
          onClick={this.handleStartEditing}
        >
          <FontAwesome name="pencil" />
        </Button>
        <OverlayTrigger placement="left" overlay={tooltip}>
          <Button
            bsStyle={
              enabled ? (satisfied ? "success" : "danger") : "warning"
            }
            style={{marginLeft: 5, width: '2.7em'}}
            onClick={onToggleChecker}
            bsSize="small"
          >
            <FontAwesome
              name={enabled ? (satisfied ? "check" : "close") : "ban"} />
          </Button>
        </OverlayTrigger>
      </div>
    )
  }

  renderEditMode() {
    const { checker, onRemoveChecker, memoFocus } = this.props
    const { type, id } = checker
    const CheckerUi = CheckerUis[type]
    if (isWIPChecker(CheckerUi.Editor)) {
      return (<div>Editor WIP for {type}</div>)
    }
    const isInputValid = Boolean(this.getValidCheckerFromState())
    const btnStyle = {
      marginLeft: 5,
      width: '2.7em',
    }
    return (
      <div style={{display: 'flex', alignItems: 'flex-end'}}>
        <div style={{flex: 1, alignSelf: 'center'}}>
          <DropdownButton
            title={Target.toString(this.state.editorState.target)}
            onSelect={this.handleSelectTarget}
            id={`presortie-checker-editor-${memoFocus}-${id}-dropdown`}
          >
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
          <CheckerUi.Editor
            value={this.state.editorState}
            onModifyValue={modifier => this.setState(modifyObject('editorState', modifier))}
          />
        </div>
        <Button
          style={btnStyle}
          onClick={onRemoveChecker}
          bsStyle="danger"
          bsSize="small"
        >
          <FontAwesome name="trash" />
        </Button>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
          }}>
          <Button
            style={{
              ...btnStyle,
              marginBottom: 5,
            }}
            onClick={this.handleCancelEditing}
            bsSize="small">
            <FontAwesome name="undo" />
          </Button>
          <Button
            disabled={!isInputValid}
            bsStyle={isInputValid ? 'success' : 'danger'}
            onClick={this.handleSaveChecker}
            style={btnStyle}
            bsSize="small">
            <FontAwesome name="save" />
          </Button>
        </div>
      </div>
    )
  }

  render() {
    const { editorState } = this.state
    return editorState ?
      this.renderEditMode() :
      this.renderViewMode()
  }
}

export {
  CheckerControl,
}
