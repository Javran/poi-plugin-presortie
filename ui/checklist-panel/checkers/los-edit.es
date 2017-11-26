import { modifyObject } from 'subtender'
import _ from 'lodash'
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

  static toEditorState = _.flow(
    modifyObject('method', MethodEdit.toEditorState),
    modifyObject('nodeFactor', String),
  )

  static fromEditorState = es => {
    const method = MethodEdit.fromEditorState(es.method)
    if (!method)
      return null
    const nodeFactor = Number(es.nodeFactor)
    if (!_.isFinite(nodeFactor))
      return null
    return _.flow(
      modifyObject('method', () => method),
      modifyObject('nodeFactor', () => nodeFactor),
    )(es)
  }

  handleModifyMethod =
    MethodEdit.defaultHandleModifyMethod(this.props.onModifyValue)

  handleChangeNodeFactor = e => {
    const nodeFactor = e.target.value
    this.props.onModifyValue(
      modifyObject('nodeFactor', () => nodeFactor)
    )
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
          />
        </div>
      </div>
    )
  }
}

export {
  LoSEdit,
}
