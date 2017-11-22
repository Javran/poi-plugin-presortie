import _ from 'lodash'
import { modifyObject } from 'subtender'
import React, { Component } from 'react'
import {
  FormControl,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'

class MethodEdit extends Component {
  static propTypes = {
    value: PTyp.object.isRequired,
    onModifyValue: PTyp.func.isRequired,
    style: PTyp.object,
    // in case we want "%" in "<num>%" or "ship(s)" in "<num> ship(s)"
    postfix: PTyp.node,
  }

  static defaultProps = {
    style: {},
    postfix: null,
  }

  static toEditorState = ({type,value}) => ({
    type,
    valueRaw: String(value),
  })

  static fromEditorState = ({type, valueRaw}) => {
    if (!['lt', 'le', 'eq', 'ge', 'gt'].includes(type))
      return null
    if (valueRaw === '')
      return null
    const value = Number(valueRaw)
    return _.isFinite(value) ? {type, value} : null
  }

  // assumes onModifyValue modifies the whole structure
  // and the method being modified is under key "method"
  static defaultHandleModifyMethod = onModifyValue => modifier =>
    onModifyValue(modifyObject('method', modifier))

  handleChangeType = e => {
    const newValue = e.target.value
    this.props.onModifyValue(modifyObject('type', () => newValue))
  }

  handleChangeValue = e => {
    const newValue = e.target.value
    this.props.onModifyValue(modifyObject('valueRaw', () => newValue))
  }

  render() {
    const {style, value, postfix} = this.props
    return (
      <div
        style={{
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
          <option value="lt">{'<'}</option>
          <option value="le">≤</option>
          <option value="eq">=</option>
          <option value="ge">≥</option>
          <option value="gt">{'>'}</option>
        </FormControl>
        <FormControl
          style={{flex: 5, marginRight: 5}}
          onChange={this.handleChangeValue}
          value={value.valueRaw}
        />
        {
          postfix
        }
      </div>
    )
  }
}

export {
  MethodEdit,
}
