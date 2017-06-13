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

class ChecklistPanel extends Component {
  static propTypes = {
    checklist: PTyp.array.isRequired,
    style: PTyp.object,

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

  render() {
    const { style, checklist } = this.props
    return (
      <Panel
        style={style}
        className="main-panel"
        header={
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{width: 'auto', flex: 1}}>Checklist</div>
            <Button
              style={{marginTop: 0}}
                    bsSize="xsmall"
                    bsStyle="success">
              <FontAwesome name="check" />
            </Button>
          </div>
        }>
        <ListGroup fill>
          <ListGroupItem key="fleet-picker">
            TODO: fleet picker
          </ListGroupItem>
          {
            checklist.map(checker => (
              <ListGroupItem key={checker.id}>
                <div>{ JSON.stringify(checker) }</div>
              </ListGroupItem>
            ))
          }
          <ListGroupItem key="add">
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
