import React, { Component } from 'react'
import {
  Button,
  OverlayTrigger, Tooltip,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../ptyp'
import { checkerExtras } from './checkers'

class CheckerControl extends Component {
  static propTypes = {
    checker: PTyp.object.isRequired,
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

  renderViewMode() {
    const { checker, problems, onToggleChecker } = this.props
    const { type, enabled } = checker
    const checkerExtra = checkerExtras[type]
    const satisfied = problems.length === 0
    const tooltip = (
      <Tooltip id={`presortie-tooltip-checker-${checker.id}`}>
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
          style={{marginLeft: 5, height: 'auto'}}
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
            style={{marginLeft: 5, height: 'auto'}}
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
    const { checker, onRemoveChecker } = this.props
    const { type } = checker
    const checkerExtra = checkerExtras[type]
    const checkerClass = checkerExtra.checker
    const isInputValid = checkerClass.isValid(this.state.checker)
    const btnStyle = {
      marginLeft: 5,
      height: 'auto',
    }
    return (
      <div style={{display: 'flex', alignItems: 'flex-end'}}>
        <div style={{flex: 1, alignSelf: 'center'}}>
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
            ...btnStyle,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
          }}>
          <Button
            style={{marginBottom: 5}}
            onClick={this.handleCancelEditing}
            bsSize="small">
            <FontAwesome name="undo" />
          </Button>
          <Button
            disabled={!isInputValid}
            bsStyle={isInputValid ? 'success' : 'danger'}
            onClick={this.handleSaveChecker}
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
