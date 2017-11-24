import { modifyObject } from 'subtender'
import React, { Component } from 'react'
import {
  FormControl,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { MethodEdit } from './method-edit'
import { FighterPower } from '../../../structs/checkers/fighter-power'

class FighterPowerEdit extends Component {
  static checkerType = 'fighter-power'

  static propTypes = {
    value: PTyp.object.isRequired,
    onModifyValue: PTyp.func.isRequired,
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

  static toEditorState =
    modifyObject('method', MethodEdit.toEditorState)

  static fromEditorState = es => {
    const method = MethodEdit.fromEditorState(es.method)
    if (!method)
      return null
    return modifyObject('method', () => method)(es)
  }

  handleModifyMethod =
    MethodEdit.defaultHandleModifyMethod(this.props.onModifyValue)

  handleChangeMode = e => {
    const mode = e.target.value
    this.props.onModifyValue(modifyObject('mode', () => mode))
  }

  render() {
    const {style, value} = this.props
    return (
      <div style={style}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
        }}>
          <div style={{flex: 1}}>Fighter Power</div>
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
          <div style={{flex: 1}}>Check Against</div>
          <FormControl
            style={{flex: 1, marginLeft: 5, padding: 0}}
            value={value.mode}
            onChange={this.handleChangeMode}
            componentClass="select">
            {
              ['min','max','basic'].map(x => (
                <option value={x} key={x}>
                  {FighterPower.describeMode(x)}
                </option>
              ))
            }
          </FormControl>
        </div>
      </div>
    )
  }
}

export {
  FighterPowerEdit,
}
