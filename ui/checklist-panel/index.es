import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Panel,
  Button,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { mergeMapStateToProps, modifyObject } from 'subtender'

import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'
import { AddCheckerPanel } from './add-checker-panel'
import { CheckerControl } from './checker-control'
import { checklistUISelector } from './selectors'
import {
  checklistSelector,
  memoFocusSelector,
  targetInfoListSelector,
} from '../../selectors'

class ChecklistPanelImpl extends Component {
  static propTypes = {
    checklist: PTyp.array.isRequired,
    style: PTyp.object,
    memoFocus: PTyp.string.isRequired,
    checkerResultsMap: PTyp.objectOf(PTyp.shape({
      problems: PTyp.arrayOf(PTyp.node).isRequired,
    })).isRequired,
    memoModify: PTyp.func.isRequired,
    targetInfoList: PTyp.array.isRequired,
  }

  static defaultProps = {
    style: {},
  }

  modifyChecklist = modifier =>
    this.props.memoModify(
      this.props.memoFocus,
      modifyObject('checklist', modifier)
    )

  handleAddChecker = partialChecker =>
    this.modifyChecklist(checklist => {
      const id = checklist.length === 0 ?
        0 :
        Math.max(...checklist.map(c => c.id))+1
      const checker = {
        ...partialChecker,
        id,
        enabled: true,
      }
      return [...checklist, checker]
    })

  handleModifyChecker = checkerId => modifier => {
    this.modifyChecklist(checklist =>
      checklist.map(checker =>
        checker.id === checkerId ? modifier(checker) : checker
      ))
  }

  handleRemoveChecker = checkerId => () =>
    this.modifyChecklist(checklist =>
      checklist.filter(checker => checker.id !== checkerId))

  handleToggleChecker = checkerId => curEnabled => () =>
    this.modifyChecklist(checklist =>
      checklist.map(c =>
        c.id !== checkerId ?
          c :
          {...c, enabled: !curEnabled}))

  render() {
    const {
      style, checklist,
      checkerResultsMap,
      memoFocus, targetInfoList,
    } = this.props
    const checklistSatisfied =
      Object.values(checkerResultsMap).every(
        c => c.problems.length === 0)

    return (
      <Panel
        style={style}
        className="main-panel"
      >
        <Panel.Heading>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{width: 'auto', flex: 1}}>Checklist</div>
            <Button
              style={{marginTop: 0}}
              bsSize="xsmall"
              bsStyle={checklistSatisfied ? "success" : "danger"}>
              <FontAwesome name={checklistSatisfied ? "check" : "close"} />
            </Button>
          </div>
        </Panel.Heading>
        <Panel.Body>
          <ListGroup>
            {
              checklist.map(checker => {
                const {id, enabled} = checker
                const problems = enabled ? checkerResultsMap[id].problems : []
                return (
                  <ListGroupItem
                    style={{padding: '8px 15px'}}
                    key={id}>
                    <CheckerControl
                      targetInfoList={targetInfoList}
                      memoFocus={memoFocus}
                      onModifyChecker={this.handleModifyChecker(id)}
                      onRemoveChecker={this.handleRemoveChecker(id)}
                      onToggleChecker={this.handleToggleChecker(id)(enabled)}
                      problems={problems}
                      checker={checker} />
                  </ListGroupItem>
                )
              })
            }
            <ListGroupItem
              style={{padding: '8px 15px'}}
              key="add">
              <AddCheckerPanel
                targetInfoList={targetInfoList}
                onAddChecker={this.handleAddChecker}
              />
            </ListGroupItem>
          </ListGroup>
        </Panel.Body>
      </Panel>
    )
  }
}

const ChecklistPanel = connect(
  mergeMapStateToProps(
    checklistUISelector,
    createStructuredSelector({
      memoFocus: memoFocusSelector,
      checklist: checklistSelector,
      targetInfoList: targetInfoListSelector,
    })),
  mapDispatchToProps
)(ChecklistPanelImpl)

export {
  ChecklistPanel,
}
