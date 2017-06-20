import React, { Component } from 'react'

import { PTyp } from '../../../ptyp'

class YasenEquipsEdit extends Component {
  static propTypes = {
    value: PTyp.object.isRequired,
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

  render() {
    const {style, value} = this.props
    return (
      <div style={style}>
        {JSON.stringify(value)}
      </div>
    )
  }
}

export {
  YasenEquipsEdit,
}
