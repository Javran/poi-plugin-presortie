import _ from 'lodash'
import { modifyObject } from 'subtender'
import React, { Component } from 'react'

import { PTyp } from '../../../ptyp'
import { MethodEdit } from './method-edit'

const yasenEquipPairs = [
  ['Searchlight', 'searchlight'],
  ['Star Shell', 'starShell'],
  ['Night Recon', 'nightRecon'],
  ['Skilled Lookouts', 'skilledLookouts'],
]

const yasenEquipPropNames =
  yasenEquipPairs.map(([_name, propName]) => propName)

class YasenEquipsEdit extends Component {
  static checkerType = 'yasen-equips'

  static propTypes = {
    value: PTyp.object.isRequired,
    onModifyValue: PTyp.func.isRequired,
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

  // every prop name of yasen equipment is a CheckMethod
  // so we transform them into modifiers and then compose.
  static toEditorState = _.flow(
    yasenEquipPropNames.map(propName =>
      modifyObject(propName, MethodEdit.toEditorState)
    )
  )

  static fromEditorState = es => {
    const methodPairs = yasenEquipPropNames.map(propName =>
      [propName, MethodEdit.fromEditorState(es[propName])]
    )
    if (methodPairs.some(([_propName, method]) => !method))
      return null
    // if all can be converted, do modification in steps
    return _.flow(
      methodPairs.map(([propName, method]) =>
        modifyObject(propName, () => method)
      )
    )(es)
  }

  handleModifyMethodWithField = fieldName => modifier =>
    this.props.onModifyValue(v => ({
      ...v,
      [fieldName]: modifier(v[fieldName]),
    }))

  render() {
    const {style, value} = this.props
    return (
      <div style={style}>
        {
          yasenEquipPairs.map(([desc, fieldName]) => (
            <div
              key={fieldName}
              style={{
                display: 'flex',
                alignItems: 'baseline',
              }}>
              <div style={{flex: 1}}>{desc}</div>
              <MethodEdit
                style={{flex: 1, marginLeft: 5}}
                value={value[fieldName]}
                onModifyValue={this.handleModifyMethodWithField(fieldName)}
              />
            </div>
          ))
        }
      </div>
    )
  }
}

export {
  YasenEquipsEdit,
}
