import React, { Component } from 'react'

import { PTyp } from '../../../ptyp'
import { MethodEdit } from './method-edit'

class CountSaiunEdit extends Component {
  static checkerType = 'count-saiun'

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
        <div style={{flex: 3}}>Ships Equipped with Saiuns</div>
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
  CountSaiunEdit,
}
