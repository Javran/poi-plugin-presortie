import _ from 'lodash'
import React, { PureComponent } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import {
  Panel,
  Button,
  ButtonToolbar,
  Dropdown,
  MenuItem,
  OverlayTrigger, Tooltip,
} from 'react-bootstrap'
import { projectorToComparator } from 'subtender'

import { PTyp } from '../../ptyp'
import {
  splitMapId,
  mapInfoArraySelector,
  getMapNameFuncSelector,
  validSortieHistorySelector,
  mapIdSelector,
} from '../../selectors'

class MapPanelImpl extends PureComponent {
  static propTypes = {
    style: PTyp.object.isRequired,
    mapId: PTyp.number.isRequired,
    mapInfoArr: PTyp.array.isRequired,
    getMapName: PTyp.func.isRequired,
    sortieHistory: PTyp.array.isRequired,
  }

  render() {
    const {style,mapInfoArr,getMapName,sortieHistory,mapId} = this.props
    const btnStyle = {marginTop: 0}
    const mapInfoGroups = _.toPairs(
      _.groupBy(mapInfoArr,'area')
    ).sort(
      projectorToComparator(([k,_v]) => Number(k))
    )

    const curMapInfo = {
      ...splitMapId(mapId),
      name: getMapName(mapId),
    }

    const lastSortieInfo =
      splitMapId(sortieHistory.length > 0 ? sortieHistory[0] : 11)

    return (
      <Panel style={style}>
        <div
          style={{
            textAlign: 'center',
            fontSize: '2em',
            marginBottom: '.5em',
          }}>
          {
            // eslint-disable-next-line prefer-template
            `${curMapInfo.area}-${curMapInfo.num}` +
            (curMapInfo.name ? `: ${curMapInfo.name}` : '')
          }
        </div>
        <ButtonToolbar style={{display: 'flex', justifyContent: 'center'}}>
          <Dropdown
            id="presortie-map-panel-select-map">
            <Dropdown.Toggle
              style={btnStyle}
            >
              Maps
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem>
                {`Last Sortie: ${lastSortieInfo.area}-${lastSortieInfo.num}`}
              </MenuItem>
              <MenuItem divider />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}>
                {
                  _.take(sortieHistory,7*4).map((id,ind) => {
                    const {area,num} = splitMapId(id)
                    return (
                      <OverlayTrigger
                        placement="right"
                        overlay={(
                          <Tooltip
                            id={`presortie-map-panel-tooltip-map-${id}`}>
                            {getMapName(id)}
                          </Tooltip>
                        )}
                        key={_.identity(ind)}>
                        <MenuItem
                          style={{
                            fontSize: '1.2em',
                            margin: '.5em',
                          }}>
                          {`${area}-${num}`}
                        </MenuItem>
                      </OverlayTrigger>
                    )
                  })
                }
              </div>
              <MenuItem divider />
              <div
                style={{
                  display: 'flex',
                  minWidth: '22em',
                  justifyContent: 'center',
                }}>
                {
                  mapInfoGroups.map(([world,ms]) => (
                    <div
                      key={world}>
                      {
                        ms.map(({area,num,id}) => (
                          <OverlayTrigger
                            placement="right"
                            overlay={(
                              <Tooltip
                                id={`presortie-map-panel-tooltip-map-${id}`}>
                                {getMapName(id)}
                              </Tooltip>
                            )}
                            key={id}>
                            <MenuItem
                              style={{
                                fontSize: '1.2em',
                                margin: '.5em',
                              }}>
                              {`${area}-${num}`}
                            </MenuItem>
                          </OverlayTrigger>
                        ))
                      }
                    </div>
                  ))
                }
              </div>
            </Dropdown.Menu>
          </Dropdown>
          <Button style={btnStyle}>General</Button>
          {
            // TODO: past maps are only shown when there are records present.
            <Button style={btnStyle}>Past Maps...</Button>
          }
        </ButtonToolbar>
      </Panel>
    )
  }
}

const MapPanel = connect(
  createStructuredSelector({
    mapInfoArr: mapInfoArraySelector,
    getMapName: getMapNameFuncSelector,
    sortieHistory: validSortieHistorySelector,
    mapId: mapIdSelector,
  }),
)(MapPanelImpl)

export { MapPanel }
