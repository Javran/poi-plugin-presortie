import React, { Component } from 'react'
import {
  Checkbox,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { MethodEdit } from './method-edit'

class MoraleEdit extends Component {
  static checkerType = 'morale'

  static propTypes = {
    value: PTyp.object.isRequired,
    onModifyValue: PTyp.func.isRequired,
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
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
    const { qualifyMethod, filterMethod, ignoreUnlocked } = value
    return (
      <div style={style}>
        <div style={{display: 'flex', alignItems: 'baseline'}}>
          <div style={{flex: 1, marginRight: 5}}>Morale</div>
          <MethodEdit
            style={{flex: 1}}
            value={filterMethod}
            onModifyValue={this.handleModifyFilterMethod}
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
          checked={ignoreUnlocked}>Ignore Unlocked Ships</Checkbox>
      </div>
    )
  }
}

export {
  MoraleEdit,
}
