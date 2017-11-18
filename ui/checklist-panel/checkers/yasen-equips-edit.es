import React, { Component } from 'react'

import { PTyp } from '../../../ptyp'
import { MethodEdit } from './method-edit'

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
          [
            ['Searchlight', 'searchlight'],
            ['Star Shell', 'starShell'],
            ['Night Recon', 'nightRecon'],
            ['Skilled Lookouts', 'skilledLookouts'],
          ].map( ([desc, fieldName]) => (
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
