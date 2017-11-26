import _ from 'lodash'
import React, { Component } from 'react'

import { PTyp } from '../../../ptyp'

class ExtraSlotsEdit extends Component {
  static checkerType = 'extra-slots'

  static propTypes = {
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

  // nothing to edit, so we just use value as editor state.
  static toEditorState = _.identity
  static fromEditorState = _.identity

  render() {
    const {style} = this.props
    return (
      <div style={style}>
        All openned extra slots should be equipped
      </div>
    )
  }
}

export {
  ExtraSlotsEdit,
}
