import { modifyObject } from 'subtender'
import React, { Component } from 'react'
import {
  Checkbox,
  OverlayTrigger, Tooltip,
  ButtonToolbar,
  Button,
} from 'react-bootstrap'

import { addStyle } from 'react-bootstrap/lib/utils/bootstrapUtils'

import { PTyp } from '../../../ptyp'
import { MethodEdit } from './method-edit'

[
  'taiha', 'chuuha', 'shouha', 'normal', 'full',
].map(healthState =>
  addStyle(Button,`hp-stat-${healthState}`)
)

class HealthEdit extends Component {
  static checkerType = 'health'

  static propTypes = {
    value: PTyp.object.isRequired,
    style: PTyp.object,
    onModifyValue: PTyp.func.isRequired,
  }

  static defaultProps = {
    style: {},
  }

  static toEditorState =
    modifyObject('method', MethodEdit.toEditorState)

  static fromEditorState = es => {
    const method = MethodEdit.fromEditorState(es.method)
    if (!method)
      return null
    return modifyObject('method', () => method)(es)
  }

  handleToggleIgnoreUnlocked = e => {
    const newValue = e.target.checked
    this.props.onModifyValue(
      modifyObject('ignoreUnlocked', () => newValue)
    )
  }

  handleModifyMethod =
    MethodEdit.defaultHandleModifyMethod(this.props.onModifyValue)

  handleToggleHealthState = healthState => isActive => () => {
    this.props.onModifyValue(
      modifyObject(
        'healthStates', healthStates => {
          let newHealthStates
          if (isActive) {
            // removing this healthState from array
            newHealthStates = healthStates.filter(hs => hs !== healthState)
          } else {
            // adding this healthState to array
            newHealthStates = healthStates.includes(healthState) ?
              healthStates :
              [...healthStates, healthState]
          }

          // prevent the change if it makes the healthStates array empty
          if (newHealthStates.length === 0)
            return healthStates

          return newHealthStates
        }
      )
    )
  }

  render() {
    const {style, value} = this.props
    return (
      <div style={style}>
        <div style={{margin: '5px 0'}}>Health state:</div>
        <ButtonToolbar style={{display: 'flex', marginLeft: 5}}>
          {
            [
              ['taiha', 'HP ≤ 25%'],
              ['chuuha', '25% < HP ≤ 50%'],
              ['shouha', '50% < HP ≤ 75%'],
              ['normal', '75% < HP < 100%'],
              ['full', 'HP = 100%'],
            ].map( ([healthState, desc]) => {
              const isActive = value.healthStates.includes(healthState)
              const tooltipPrefix = typeof value.id === 'undefined' ?
                'add' :
                `checker-${value.id}`
              const tooltip = (
                <Tooltip id={`tooltip-presortie-${tooltipPrefix}-health`}>
                  {desc}
                </Tooltip>
              )
              return (
                <OverlayTrigger placement="top" overlay={tooltip} key={healthState}>
                  <Button
                    className="btn-hp-stat"
                    bsStyle={isActive ? `hp-stat-${healthState}` : 'default'}
                    onClick={this.handleToggleHealthState(healthState)(isActive)}
                    style={{flex: 1, margin: '5px 2px'}}>
                    {healthState}
                  </Button>
                </OverlayTrigger>
              )
            })
          }
        </ButtonToolbar>
        <div>Number of ships with one of the active states above:</div>
        <MethodEdit
          style={{marginLeft: 5}}
          value={value.method}
          onModifyValue={this.handleModifyMethod}
        />
        <Checkbox
          onChange={this.handleToggleIgnoreUnlocked}
          checked={value.ignoreUnlocked}>Ignore Unlocked Ships</Checkbox>
      </div>
    )
  }
}

export {
  HealthEdit,
}
