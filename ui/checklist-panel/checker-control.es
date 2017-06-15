import React, { Component } from 'react'
import {
  Button,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../ptyp'
import { checkerExtras } from './checkers'

class CheckerControl extends Component {
  static propTypes = {
    checker: PTyp.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      checker: props.checker,
    }
  }

  render() {
    const { checker } = this.props
    const { editing } = this.state
    const { type } = checker
    const checkerExtra = checkerExtras[type]
    return (
      <div style={{display: 'flex', alignItems: 'flex-end'}}>
        <div style={{flex: 1}}>
          <checkerExtra.viewer
            checker={checker}
            style={editing ? {display: 'none'} : {}}
          />
          <checkerExtra.editor
            value={this.state.checker}
            onModifyValue={() => {}}
            style={editing ? {} : {display: 'none'}}
          />
        </div>
        <Button
          style={{marginLeft: 5, height: 'auto'}}
          bsSize="small"
        >
          <FontAwesome name="pencil" />
        </Button>
        <Button
          style={{marginLeft: 5, height: 'auto'}}
          bsSize="small"
        >
          <FontAwesome name="check" />
        </Button>
      </div>

    )
  }
}

export {
  CheckerControl,
}
