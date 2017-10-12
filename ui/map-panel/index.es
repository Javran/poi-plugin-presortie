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
import { mapInfoArraySelector } from '../../selectors'

class MapPanelImpl extends PureComponent {
  static propTypes = {
    style: PTyp.object.isRequired,
    mapInfoArr: PTyp.array.isRequired,
  }

  render() {
    const {style,mapInfoArr} = this.props
    const btnStyle = {marginTop: 0}
    const mapInfoGroups = _.toPairs(
      _.groupBy(mapInfoArr,'area')
    ).sort(
      projectorToComparator(([k,_v]) => Number(k))
    )

    return (
      <Panel style={style}>
        <div
          style={{
            textAlign: 'center',
            fontSize: '2em',
            marginBottom: '.5em',
          }}>
          3-3
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
              <MenuItem>Last Sortie: ???</MenuItem>
              <MenuItem divider />
              <MenuItem>History 1</MenuItem>
              <MenuItem>History 2</MenuItem>
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
                        ms.map(({area,num,name,id}) => (
                          <OverlayTrigger
                            placement="right"
                            overlay={(
                              <Tooltip
                                id={`presortie-map-panel-tooltip-map-${id}`}>
                                {name}
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
  }),
)(MapPanelImpl)

export { MapPanel }
