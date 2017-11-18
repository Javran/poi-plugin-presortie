import React, { Component } from 'react'

import { PTyp } from '../../../ptyp'
import { MethodEdit } from './method-edit'

class OASWEdit extends Component {
  static checkerType = 'oasw'

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

  render() {
    const {style, value} = this.props
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        ...style,
      }}>
        <div style={{flex: 3}}>OASW-capable ships</div>
        <MethodEdit
          style={{flex: 3, marginLeft: 5}}
          value={value.method}
          onModifyValue={this.handleModifyMethod}
        />
      </div>
    )
  }
}

export {
  OASWEdit,
}
