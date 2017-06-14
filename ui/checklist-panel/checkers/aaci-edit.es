import React, { Component } from 'react'
import {
  FormControl,
  Checkbox,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'

class AACIEdit extends Component {
  static propTypes = {
    value: PTyp.object.isRequired,
    onModifyValue: PTyp.func.isRequired,
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

  render() {
    const {style} = this.props
    return (
      <div style={style}>
        AACI: TODO
      </div>
    )
  }
}

export {
  AACIEdit,
}
