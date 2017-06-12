import React, { Component } from 'react'
import {
  DropdownButton,
  MenuItem,
} from 'react-bootstrap'

import { PTyp } from '../ptyp'
import { MapInfo, DynMapId } from '../structs'
import { loadPState } from '../p-state'
import { observeAll } from '../observers'

import { SortieAreaPicker } from './sortie-area-picker'

class PresortieMain extends Component {
  static propTypes = {
    mapInfoArray: PTyp.array.isRequired,
    sortieHistory: PTyp.array.isRequired,
    dynMapId: PTyp.DynMapId.isRequired,

    onInit: PTyp.func.isRequired,
    onDynMapIdChange: PTyp.func.isRequired,
  }

  componentDidMount() {
    const { onInit } = this.props
    this.unsubscribe = observeAll()
    setTimeout(() => {
      onInit(loadPState())
    })
  }

  componentWillUnmount() {
    if (this.unsubscribe !== null) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }

  render() {
    const {
      mapInfoArray, sortieHistory,
      dynMapId, onDynMapIdChange,
    } = this.props
    return (
      <div
        style={{margin: 5}}
      >
        <SortieAreaPicker
          mapInfoArray={mapInfoArray}
          sortieHistory={sortieHistory}
          dynMapId={dynMapId}
          onDynMapIdChange={onDynMapIdChange}
        />
      </div>
    )
  }
}

export {
  PresortieMain,
}
