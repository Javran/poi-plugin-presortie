import React, { Component } from 'react'

import { PTyp } from '../../../ptyp'

class ExtraSlotsEdit extends Component {
  static propTypes = {
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

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
