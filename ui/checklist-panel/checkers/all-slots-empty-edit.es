import React, { Component } from 'react'
import {
  FormControl,
  Checkbox,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'

class AllSlotsEmptyEdit extends Component {
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
    const { onModifyValue } = this.props
    onModifyValue(allSlots => ({
      ...allSlots,
      ignoreExtra: newValue,
    }))
  }

  handleToggleIgnoreUnlocked = e => {
    const newValue = e.target.checked
    const { onModifyValue } = this.props
    onModifyValue(allSlots => ({
      ...allSlots,
      ignoreUnlocked: newValue,
    }))
  }

  handleChangeMethodType = e => {
    const newValue = e.target.value
    const { onModifyValue } = this.props
    onModifyValue(allSlots => ({
      ...allSlots,
      method: {
        ...allSlots.method,
        type: newValue,
      },
    }))
  }

  handleChangeMethodValue = e => {
    const newValue = parseInt(e.target.value,10)
    const { onModifyValue } = this.props
    onModifyValue(allSlots => ({
      ...allSlots,
      method: {
        ...allSlots.method,
        value: newValue,
      },
    }))
  }

  render() {
    const {style, value} = this.props
    return (
      <div style={style}>
        <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
          <div style={{flex: 3}}>Ships without Equipments</div>
          <div
            style={{
              flex: 5,
              display: 'flex',
              alignItems: 'baseline',
              marginLeft: 5,
            }}
          >
            <FormControl
              style={{flex: 2, marginRight: 5}}
              onChange={this.handleChangeMethodType}
              value={value.method.type}
              componentClass="select">
              <option value="le">≤</option>
              <option value="eq">=</option>
              <option value="ge">≥</option>
            </FormControl>
            <FormControl
              style={{flex: 5, marginRight: 5}}
              onChange={this.handleChangeMethodValue}
              value={value.method.value}
              type="number" />
            <div
              style={{flex: 2}}
            >
              Ship(s)
            </div>
          </div>
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
