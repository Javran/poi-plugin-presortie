import React, { Component } from 'react'
import {
  FormControl,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'

class MethodEdit extends Component {
  static propTypes = {
    value: PTyp.CheckMethod.isRequired,
    onModifyValue: PTyp.func.isRequired,
    style: PTyp.object,
    postfix: PTyp.node,
  }

  static defaultProps = {
    style: {},
    postfix: null,
  }

  handleChangeType = e => {
    const newValue = e.target.value
    const { onModifyValue } = this.props
    onModifyValue(v => ({
      ...v,
      type: newValue,
    }))
  }

  handleChangeValue = e => {
    const newValue = parseInt(e.target.value,10)
    const { onModifyValue } = this.props
    onModifyValue(v => ({
      ...v,
      value: newValue,
    }))
  }

  render() {
    const {style, value, postfix} = this.props
    return (
      <div
        style={{
          flex: 5,
          display: 'flex',
          alignItems: 'baseline',
          ...style,
        }}
      >
        <FormControl
          style={{flex: 2, marginRight: 5}}
          onChange={this.handleChangeType}
          value={value.type}
          componentClass="select">
          <option value="le">≤</option>
          <option value="eq">=</option>
          <option value="ge">≥</option>
        </FormControl>
        <FormControl
          style={{flex: 5, marginRight: 5}}
          onChange={this.handleChangeValue}
          value={value.value}
          type="number" />
        {
          postfix && (
            <div
              style={{flex: 2}}
              >
              {postfix}
            </div>
          )
        }
      </div>
    )
  }
}

export {
  MethodEdit,
}
