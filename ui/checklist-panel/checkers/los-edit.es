import React, { Component } from 'react'
import {
  FormControl,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { MethodEdit } from './method-edit'

class LoSEdit extends Component {
  static checkerType = 'los'

  static propTypes = {
    value: PTyp.object.isRequired,
    onModifyValue: PTyp.func.isRequired,
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

  handleModifyMethod =
    MethodEdit.defaultHandleModifyMethod(this.props.onModifyValue)

  handleChangeNodeFactor = e => {
    const nodeFactor = parseInt(e.target.value,10)
    const { onModifyValue } = this.props
    onModifyValue(v => ({
      ...v,
      nodeFactor,
    }))
  }

  render() {
    const {style, value} = this.props
    return (
      <div style={style}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
        }}>
          <div style={{flex: 1}}>Line Of Sight</div>
          <MethodEdit
            style={{flex: 1, marginLeft: 5}}
            value={value.method}
            onModifyValue={this.handleModifyMethod}
          />
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
        }}>
          <div style={{flex: 1}}>Node Factor</div>
          <FormControl
            style={{flex: 1, marginLeft: 5}}
            onChange={this.handleChangeNodeFactor}
            value={value.nodeFactor}
            type="number" />
        </div>
      </div>
    )
  }
}

export {
  LoSEdit,
}
