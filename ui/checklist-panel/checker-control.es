import React, { Component } from 'react'
import {
  Button,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../ptyp'

class CheckerControl extends Component {
  static propTypes = {
    checker: PTyp.object.isRequired,
  }

  render() {
    const { checker } = this.props
    return (
      <div style={{display: 'flex', alignItems: 'flex-end'}}>
        <div style={{flex: 1}}>
          {
            JSON.stringify(checker)
          }
        </div>
        <Button
          style={{marginLeft: 5, height: 'auto'}}
          bsSize="small"
        >
          <FontAwesome name="edit" />
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
