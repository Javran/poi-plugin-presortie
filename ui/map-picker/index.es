import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  DropdownButton,
  MenuItem,
} from 'react-bootstrap'
import { modifyObject } from 'subtender'

import { PTyp } from '../../ptyp'
import { MapInfo, SelectedMap } from '../../structs'
import { mapDispatchToProps } from '../../store'
import {
  mapInfoArraySelector,
  sortieHistorySelector,
  selectedMapSelector,
  mapIdSelector,
} from '../../selectors'

class MapPickerImpl extends Component {
  static propTypes = {
    style: PTyp.object.isRequired,

    mapInfoArray: PTyp.array.isRequired,
    sortieHistory: PTyp.array.isRequired,
    selectedMap: PTyp.object.isRequired,
    mapId: PTyp.MapId.isRequired,

    persistModify: PTyp.func.isRequired,
  }

  handleSelectMap = k => {
    const selectedMap =
      k === 'last' ? {type: 'last'} :
      {type: 'id', mapId: k}

    this.props.persistModify(
      modifyObject(
        'selectedMap', () => selectedMap
      )
    )
  }

  render() {
    const {
      mapInfoArray, sortieHistory,
      mapId, selectedMap,
      style,
    } = this.props
    const findMapInfo = MapInfo.findMapInfo(mapInfoArray)
    const mapInfo = findMapInfo(mapId)
    const sortieTextHeader =
      SelectedMap.destruct({
        id: () => 'Sortie Area',
        last: () => 'Last Sortie',
      })(selectedMap)
    const sortieText = `${sortieTextHeader}: ${MapInfo.toString(mapInfo)}`
    return (
      <DropdownButton
        style={style}
        title={sortieText}
        onSelect={this.handleSelectMap}
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

const MapPicker = connect(
  createStructuredSelector({
    mapInfoArray: mapInfoArraySelector,
    sortieHistory: sortieHistorySelector,
    selectedMap: selectedMapSelector,
    mapId: mapIdSelector,
  }),
  mapDispatchToProps,
)(MapPickerImpl)

export {
  MapPicker,
}
