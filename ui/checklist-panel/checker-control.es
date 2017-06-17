import React, { Component } from 'react'
import {
  Button,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../ptyp'
import { checkerExtras } from './checkers'

class CheckerControl extends Component {
  static propTypes = {
    checker: PTyp.object.isRequired,
    onModifyChecker: PTyp.func.isRequired,
    onRemoveChecker: PTyp.func.isRequired,
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
    const { checker } = this.props
    const { type } = checker
    const checkerExtra = checkerExtras[type]
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
        <Button
          bsStyle={/* TODO: consider check results */
            checker.enabled ? "default" : "warning"
          }
          style={{marginLeft: 5, height: 'auto'}}
          bsSize="small"
        >
          <FontAwesome name="check" />
        </Button>
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
