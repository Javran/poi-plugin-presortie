import React, { Component } from 'react'
import {
  Button,
  OverlayTrigger, Tooltip,
  DropdownButton, MenuItem,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { modifyObject } from 'subtender'

import { PTyp } from '../../ptyp'
import { checkerExtras } from './checkers'
import { Target } from '../../structs'

class CheckerControl extends Component {
  static propTypes = {
    checker: PTyp.object.isRequired,
    memoFocus: PTyp.string.isRequired,
    problems: PTyp.array,
    onModifyChecker: PTyp.func.isRequired,
    onRemoveChecker: PTyp.func.isRequired,
    onToggleChecker: PTyp.func.isRequired,
  }

  static defaultProps = {
    problems: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      checker: props.checker,
    }
  }

  handleStartEditing = () => {
    const { checker } = this.props
    this.setState({
      editing: true,
      checker,
    })
  }

  handleCancelEditing = () =>
    this.setState({editing: false})

  handleModifyStateChecker = modifier =>
    this.setState(state => ({
      ...state,
      checker: modifier(state.checker),
    }))

  handleSaveChecker = () => {
    const { onModifyChecker } = this.props
    onModifyChecker(() => this.state.checker)
    this.setState({editing: false})
  }

  handleSelectTarget = target =>
    this.handleModifyStateChecker(
      modifyObject('target', () => target),
    )

  renderViewMode() {
    const { checker, problems, onToggleChecker } = this.props
    const { type, enabled } = checker
    const checkerExtra = checkerExtras[type]
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
          <checkerExtra.viewer
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
    const checkerExtra = checkerExtras[type]
    const checkerClass = checkerExtra.checker
    const isInputValid = checkerClass.isValid(this.state.checker)
    const btnStyle = {
      marginLeft: 5,
      width: '2.7em',
    }
    return (
      <div style={{display: 'flex', alignItems: 'flex-end'}}>
        <div style={{flex: 1, alignSelf: 'center'}}>
          <DropdownButton
            title={Target.toString(this.state.checker.target)}
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
          <checkerExtra.editor
            value={this.state.checker}
            onModifyValue={this.handleModifyStateChecker}
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
    const { editing } = this.state
    return editing ?
      this.renderEditMode() :
      this.renderViewMode()
  }
}


export {
  CheckerControl,
}
