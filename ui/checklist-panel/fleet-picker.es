import React, { Component } from 'react'
import {
  FormControl,
} from 'react-bootstrap'

import { PTyp } from '../../ptyp'

const fleetInfoToText = fleetInfo => {
  const header = `Fleet#${fleetInfo.id} ${fleetInfo.name}`
  const { flagship } = fleetInfo
  const shipText = [
    `${flagship.name}`,
    `Lv.${flagship.level}`,
    `(${flagship.rosterId})`,
  ].join(' ')
  return `${header} Flagship: ${shipText}`
}

class FleetPicker extends Component {
  static propTypes = {
    fleetId: PTyp.number.isRequired,
    allFleetInfo: PTyp.arrayOf(PTyp.FleetInfo).isRequired,
    onFleetIdChange: PTyp.func.isRequired,
  }

  handleFleetIdChange = e => {
    const fleetId = parseInt(e.target.value,10)
    const { onFleetIdChange } = this.props
    onFleetIdChange(fleetId)
  }

  render() {
    const { fleetId, allFleetInfo } = this.props
    return (
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
      }}>
        <span style={{flex: 1}}>Sortie Fleet:</span>
        <FormControl
          style={{marginLeft: 5, flex: 5}}
          value={fleetId}
          onChange={this.handleFleetIdChange}
          componentClass="select">
          {
            allFleetInfo.map(fleetInfo => (
              <option
                value={fleetInfo.id}
                key={fleetInfo.id}>
                {fleetInfoToText(fleetInfo)}
              </option>
            ))
          }
        </FormControl>
      </div>
    )
  }
}

export {
  FleetPicker,
}
