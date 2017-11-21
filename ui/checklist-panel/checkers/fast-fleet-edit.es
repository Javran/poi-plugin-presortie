import _ from 'lodash'
import React, { Component } from 'react'
import {
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'

class FastFleetEdit extends Component {
  static checkerType = 'fast-fleet'

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
    return (
      <div style={this.props.style}>
        Require a fast fleet
      </div>
    )
  }
}

export {
  FastFleetEdit,
}
