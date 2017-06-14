import React, { Component } from 'react'
import {
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'

class FastFleetEdit extends Component {
  static propTypes = {
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

  render() {
    return (
      <div style={this.props.style}>
        The Speed of Every Fleet Member Is At Least Fast.
      </div>
    )
  }
}

export {
  FastFleetEdit,
}
