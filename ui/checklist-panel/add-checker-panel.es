import React, { Component } from 'react'
import {
  FormControl,
  Checkbox,
  Button,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { AllSlotsEdit } from './checkers/all-slots-edit'
import { PTyp } from '../../ptyp'

const defaultAllSlots = {
  type: 'all-slots',
  method: {type: 'eq', value: 6},
  ignoreExtra: false,
}

class AddCheckerPanel extends Component {
  static propTypes = {
    onAddChecker: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      allSlots: defaultAllSlots,
    }
  }

  handleModifyValue = checkerName => modifier =>
    this.setState(state => ({
      ...state,
      [checkerName]: modifier(state[checkerName]),
    }))

  handleAddChecker = () => {
    const partialChecker = this.state.allSlots
    const { onAddChecker } = this.props
    onAddChecker(partialChecker)
    this.setState({ allSlots: defaultAllSlots })
  }

  handleReset = () =>
    this.setState({ allSlots: defaultAllSlots })

  render() {
    return (
      <div style={{display: 'flex', alignItems: 'flex-end'}}>
        <AllSlotsEdit
          style={{flex: 1}}
          allSlots={this.state.allSlots}
          onModifyValue={this.handleModifyValue('allSlots')}
        />
        <Button
          style={{marginLeft: 5, height: 'auto'}}
          bsSize="small"
          onClick={this.handleReset}
        >
          <FontAwesome name="undo" />
        </Button>
        <Button
          style={{marginLeft: 5, height: 'auto'}}
          bsSize="small"
          onClick={this.handleAddChecker}
        >
          <FontAwesome name="plus" />
        </Button>
      </div>
    )
  }
}

export {
  AddCheckerPanel,
}
