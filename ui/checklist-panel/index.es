import React, { Component } from 'react'
import {
  Panel,
  Button,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../ptyp'
import { AddCheckerPanel } from './add-checker-panel'
import { FleetPicker } from './fleet-picker'
import { CheckerControl } from './checker-control'

class ChecklistPanel extends Component {
  static propTypes = {
    checklist: PTyp.array.isRequired,
    style: PTyp.object,
    fleetId: PTyp.number.isRequired,
    allFleetInfo: PTyp.array.isRequired,

    onFleetIdChange: PTyp.func.isRequired,
    onModifyMapExtra: PTyp.func.isRequired,
  }

  static defaultProps = {
    style: {},
  }

  handleModifyChecklist = modifier => {
    const { onModifyMapExtra } = this.props
    onModifyMapExtra(mapExtra => ({
      ...mapExtra,
      checklist: modifier(mapExtra.checklist),
    }))
  }

  handleAddChecker = partialChecker =>
    this.handleModifyChecklist(checklist => {
      const id = checklist.length === 0 ?
        0 :
        Math.max(...checklist.map(c => c.id))+1
      const checker = {
        ...partialChecker,
        id,
      }
      return [...checklist, checker]
    })

  handleModifyChecker = checkerId => modifier => {
    this.handleModifyChecklist(checklist =>
      checklist.map(checker =>
        checker.id === checkerId ? modifier(checker) : checker
      ))
  }

  render() {
    const {
      style, checklist,
      fleetId, allFleetInfo, onFleetIdChange,
    } = this.props
    return (
      <Panel
        style={style}
        className="main-panel"
        header={
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{width: 'auto', flex: 1}}>Checklist</div>
            <Button style={{marginTop: 0}} bsSize="xsmall" bsStyle="success">
              <FontAwesome name="check" />
            </Button>
          </div>
        }>
        <ListGroup fill>
          <ListGroupItem
            style={{padding: '8px 15px'}}
            key="fleet-picker">
            <FleetPicker
              fleetId={fleetId}
              allFleetInfo={allFleetInfo}
              onFleetIdChange={onFleetIdChange}
            />
          </ListGroupItem>
          {
            checklist.map(checker => (
              <ListGroupItem
                style={{padding: '8px 15px'}}
                key={checker.id}>
                <CheckerControl
                  onModifyChecker={this.handleModifyChecker(checker.id)}
                  checker={checker} />
              </ListGroupItem>
            ))
          }
          <ListGroupItem
            style={{padding: '8px 15px'}}
            key="add">
            <AddCheckerPanel
              onAddChecker={this.handleAddChecker}
            />
          </ListGroupItem>
        </ListGroup>
      </Panel>
    )
  }

}

export {
  ChecklistPanel,
}
