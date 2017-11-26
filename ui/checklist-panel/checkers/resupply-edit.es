import { modifyObject } from 'subtender'
import _ from 'lodash'
import React, { Component } from 'react'
import {
  FormControl, Checkbox,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { MethodEdit } from './method-edit'

class ResupplyEdit extends Component {
  static checkerType = 'resupply'
  static propTypes = {
    value: PTyp.object.isRequired,
    onModifyValue: PTyp.func.isRequired,
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

  static toEditorState = _.flow(
    modifyObject('filterMethod', MethodEdit.toEditorState),
    modifyObject('qualifyMethod', MethodEdit.toEditorState)
  )

  static fromEditorState = es => {
    const filterMethod = MethodEdit.fromEditorState(es.filterMethod)
    if (!filterMethod)
      return null
    const qualifyMethod = MethodEdit.fromEditorState(es.qualifyMethod)
    if (!qualifyMethod)
      return null

    return _.flow(
      modifyObject('filterMethod', () => filterMethod),
      modifyObject('qualifyMethod', () => qualifyMethod),
    )(es)
  }

  handleResourceChange = e => {
    const resource = e.target.value
    this.props.onModifyValue(
      modifyObject('resource', () => resource)
    )
  }

  handleModifyQualifyMethod = modifier =>
    this.props.onModifyValue(
      modifyObject('qualifyMethod', modifier)
    )

  handleModifyFilterMethod = modifier =>
    this.props.onModifyValue(
      modifyObject('filterMethod', modifier)
    )

  handleToggleIgnoreUnlocked = e => {
    const newValue = e.target.checked
    this.props.onModifyValue(
      modifyObject('ignoreUnlocked', () => newValue)
    )
  }

  render() {
    const {style, value} = this.props
    const { qualifyMethod, filterMethod, resource, ignoreUnlocked } = value
    return (
      <div style={style}>
        <div style={{display: 'flex', alignItems: 'baseline'}}>
          <FormControl
            style={{flex: 1, padding: 0, marginRight: 5}}
            value={resource}
            onChange={this.handleResourceChange}
            componentClass="select">
            <option value="fuel-and-ammo">Fuel & Ammo</option>
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
          checked={ignoreUnlocked}>Ignore Unlocked Ships</Checkbox>
      </div>
    )
  }
}

export {
  ResupplyEdit,
}
