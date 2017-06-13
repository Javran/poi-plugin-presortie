import React, { Component } from 'react'
import {
  Button,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { AllSlotsEmptyEdit } from './checkers/all-slots-empty-edit'
import { PTyp } from '../../ptyp'

/*

   TODO:

   - fast-fleet
   - aaci
   - oasw
   - has-saiun
   - has-radar
   - fighter-power
   - resupply
   - health

 */

class AddCheckerPanel extends Component {
  static propTypes = {
    onAddChecker: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      allSlotsEmpty: AllSlotsEmptyEdit.defaultValue,
    }
  }

  handleModifyValue = checkerName => modifier =>
    this.setState(state => ({
      ...state,
      [checkerName]: modifier(state[checkerName]),
    }))

  handleAddChecker = () => {
    const partialChecker = this.state.allSlotsEmpty
    const { onAddChecker } = this.props
    onAddChecker(partialChecker)
    this.setState({ allSlotsEmpty: AllSlotsEmptyEdit.defaultValue })
  }

  handleReset = () =>
    this.setState({ allSlotsEmpty: AllSlotsEmptyEdit.defaultValue })

  render() {
    return (
      <div style={{display: 'flex', alignItems: 'flex-end'}}>
        <AllSlotsEmptyEdit
          style={{flex: 1}}
          allSlotsEmpty={this.state.allSlotsEmpty}
          onModifyValue={this.handleModifyValue('allSlotsEmpty')}
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
