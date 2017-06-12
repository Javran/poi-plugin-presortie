import React, { Component } from 'react'
import {
  Panel,
  ListGroup, ListGroupItem,
  Button,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'
const { FontAwesome } = window

class NotesPanel extends Component {
  static propTypes = {
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }
  render() {
    const { style } = this.props
    return (
      <Panel
        style={style}
        className="main-panel"
        header="Notes">
        TODO
      </Panel>
    )
  }
}

export {
  NotesPanel,
}
