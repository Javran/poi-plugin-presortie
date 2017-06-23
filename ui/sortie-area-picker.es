import React, { Component } from 'react'
import {
  DropdownButton,
  MenuItem,
} from 'react-bootstrap'

import { PTyp } from '../ptyp'
import { MapInfo } from '../structs'

class SortieAreaPicker extends Component {
  static propTypes = {
    mapInfoArray: PTyp.arrayOf(PTyp.MapInfo).isRequired,
    sortieHistory: PTyp.arrayOf(PTyp.MapId).isRequired,
    dynMapId: PTyp.DynMapId.isRequired,
    mapId: PTyp.MapId.isRequired,
    style: PTyp.object,

    onDynMapIdChange: PTyp.func.isRequired,
  }

  static defaultProps = {
    style: {},
  }

  render() {
    const {
      mapInfoArray, sortieHistory,
      mapId, dynMapId, onDynMapIdChange,
      style,
    } = this.props
    const findMapInfo = MapInfo.findMapInfo(mapInfoArray)
    const mapInfo = findMapInfo(mapId)
    const sortieTextHeader =
      dynMapId === 'last' ? 'Last Sortie' : 'Sortie Area'
    const sortieText = `${sortieTextHeader}: ${MapInfo.toString(mapInfo)}`
    return (
      <DropdownButton
        style={style}
        title={sortieText}
        onSelect={onDynMapIdChange}
        key={mapId}
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
              ...sortieHistory.map((thisMapId,ind) => (
                <MenuItem
                  key={
                    // eslint-disable-next-line react/no-array-index-key
                    `hist-${ind}`} eventKey={thisMapId}>
                  {`History #${ind+1}: ${MapInfo.toString(findMapInfo(thisMapId))}`}
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
