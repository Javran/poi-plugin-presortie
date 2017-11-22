import { modifyObject } from 'subtender'
import React, { Component } from 'react'
import {
  Checkbox,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { MethodEdit } from './method-edit'

/* TODO to be tested */
class AllSlotsEmptyEdit extends Component {
  static checkerType = 'all-slots-empty'

  static propTypes = {
    value: PTyp.PartialChecker.AllSlotsEmpty.isRequired,
    onModifyValue: PTyp.func.isRequired,
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

  // simply turning "method" into its editor state should do.
  static toEditorState =
    modifyObject('method', MethodEdit.toEditorState)

  static fromEditorState = es => {
    const method = MethodEdit.fromEditorState(es.method)
    if (!method)
      return null
    return modifyObject('method', () => method)(es)
  }

  handleToggleIgnoreExtra = e => {
    const newValue = e.target.checked
    this.props.onModifyValue(
      modifyObject('ignoreExtra', () => newValue)
    )
  }

  handleToggleIgnoreUnlocked = e => {
    const newValue = e.target.checked
    this.props.onModifyValue(
      modifyObject('ignoreUnlocked', () => newValue)
    )
  }

  handleModifyMethod =
    MethodEdit.defaultHandleModifyMethod(this.props.onModifyValue)

  render() {
    const {style, value} = this.props
    return (
      <div style={style}>
        <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
          <div style={{flex: 3}}>Ships without Equipments</div>
          <MethodEdit
            style={{flex: 3, marginLeft: 5}}
            value={value.method}
            onModifyValue={this.handleModifyMethod}
          />
        </div>
        <Checkbox
          onChange={this.handleToggleIgnoreExtra}
          checked={value.ignoreExtra}>Ignore Extra Slots</Checkbox>
        <Checkbox
          onChange={this.handleToggleIgnoreUnlocked}
          checked={value.ignoreUnlocked}>Ignore Unlocked Ships</Checkbox>
      </div>
    )
  }
}

export {
  AllSlotsEmptyEdit,
}
