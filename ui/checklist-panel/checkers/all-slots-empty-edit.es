import { modifyObject } from 'subtender'
import React, { Component } from 'react'
import {
  Checkbox,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { MethodEdit } from './method-edit'

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

  handleChangeMethodType = e => {
    const newValue = e.target.value
    this.props.onModifyValue(
      modifyObject(
        'method',
        modifyObject('type', () => newValue)
      )
    )
  }

  handleChangeMethodValue = e => {
    const newValue = parseInt(e.target.value,10)
    this.props.onModifyValue(
      modifyObject(
        'method',
        modifyObject('value', () => newValue)
      )
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
