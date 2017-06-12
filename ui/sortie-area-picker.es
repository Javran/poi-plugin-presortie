import React, { Component } from 'react'
import {
  DropdownButton,
  MenuItem,
} from 'react-bootstrap'

import { PTyp } from '../ptyp'
import { MapInfo, DynMapId } from '../structs'

class SortieAreaPicker extends Component {
  static propTypes = {
    mapInfoArray: PTyp.arrayOf(PTyp.MapInfo).isRequired,
    sortieHistory: PTyp.arrayOf(PTyp.MapId).isRequired,
    dynMapId: PTyp.DynMapId.isRequired,

    onDynMapIdChange: PTyp.func.isRequired,
  }

  render() {
    const {
      mapInfoArray, sortieHistory,
      dynMapId, onDynMapIdChange,
    } = this.props
    const curMapId = DynMapId.toMapId(dynMapId,sortieHistory)
    const findMapInfo = MapInfo.findMapInfo(mapInfoArray)
    const curMapInfo = findMapInfo(curMapId)
    const sortieTextHeader =
      dynMapId === 'last' ? 'Last Sortie' : 'Sortie Area'
    const sortieText = `${sortieTextHeader}: ${MapInfo.toString(curMapInfo)}`
    return (
      <DropdownButton
        title={sortieText}
        onSelect={onDynMapIdChange}
        key={curMapId}
        id={`presortie-dropdown-sortie-area`}>
        {
          ( sortieHistory.length > 0 && (
            [
              <MenuItem
                key="last-sortie"
                eventKey="last">
                {`Last Sortie: ${MapInfo.toString(findMapInfo(sortieHistory[0]))}`}
              </MenuItem>,
              <MenuItem divider key="d1" />,
              ...sortieHistory.map((mapId,ind) => (
                <MenuItem
                  key={
                    // eslint-disable-next-line react/no-array-index-key
                    `hist-${ind}`} eventKey={mapId}>
                  {`History #${ind+1}: ${MapInfo.toString(findMapInfo(mapId))}`}
                </MenuItem>)),
              <MenuItem divider key="d2" />,
            ]
          ))
        }
        {
          mapInfoArray.map( x => (
            <MenuItem
              key={x.id} eventKey={x.id}>
              {MapInfo.toString(x)}
            </MenuItem>
          ))
        }
      </DropdownButton>
    )
  }
}

export {
  SortieAreaPicker,
}
