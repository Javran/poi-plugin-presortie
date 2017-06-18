import React, { Component } from 'react'
import {
  FormControl, Checkbox,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { MethodEdit } from './method-edit'

class ResupplyEdit extends Component {
  static propTypes = {
    value: PTyp.object.isRequired,
    onModifyValue: PTyp.func.isRequired,
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

  handleResourceChange = e => {
    const resource = e.target.value
    this.props.onModifyValue(v => ({
      ...v,
      resource,
    }))
  }

  handleModifyQualifyMethod = modifier =>
    this.props.onModifyValue(v => ({
      ...v,
      qualifyMethod: modifier(v.qualifyMethod),
    }))

  handleModifyFilterMethod = modifier =>
    this.props.onModifyValue(v => ({
      ...v,
      filterMethod: modifier(v.filterMethod),
    }))

  handleToggleIgnoreUnlocked = e => {
    const newValue = e.target.checked
    const { onModifyValue } = this.props
    onModifyValue(value => ({
      ...value,
      ignoreUnlocked: newValue,
    }))
  }

  render() {
    const {style, value} = this.props
    const { qualifyMethod, filterMethod, resource } = value
    return (
      <div style={style}>
        <div style={{display: 'flex', alignItems: 'baseline'}}>
          <FormControl
            style={{flex: 1, padding: 0, marginRight: 5}}
            value={resource}
            onChange={this.handleResourceChange}
            componentClass="select">
            <option value="fual-and-ammo">Fuel & Ammo</option>
            <option value="fuel">Fuel</option>
            <option value="ammo">Ammo</option>
          </FormControl>
          <MethodEdit
            style={{flex: 1}}
            value={filterMethod}
            onModifyValue={this.handleModifyFilterMethod}
            postfix="%"
          />
        </div>
        <div style={{display: 'flex', alignItems: 'baseline'}}>
          <div style={{flex: 1, marginRight: 5}}>Ship Count</div>
          <MethodEdit
            style={{flex: 1}}
            value={qualifyMethod}
            onModifyValue={this.handleModifyQualifyMethod}
          />
        </div>
        <Checkbox
          onChange={this.handleToggleIgnoreUnlocked}
          checked={value.ignoreUnlocked}>Ignore Unlocked Ships</Checkbox>
      </div>
    )
  }
}

export {
  ResupplyEdit,
}
