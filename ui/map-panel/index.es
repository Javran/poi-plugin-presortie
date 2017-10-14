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
import {
  modifyObject, not,
  projectorToComparator,
} from 'subtender'

import { PTyp } from '../../ptyp'
import {
  splitMapId,
  mapInfoArraySelector,
  getMapNameFuncSelector,
  validSortieHistorySelector,
  memoFocusSelector,
  memoIdToDescFuncSelector,
} from '../../selectors'
import {
  mapDispatchToProps,
} from '../../store'

class MapPanelImpl extends PureComponent {
  static propTypes = {
    style: PTyp.object.isRequired,
    memoFocus: PTyp.string.isRequired,
    mapInfoArr: PTyp.array.isRequired,
    getMapName: PTyp.func.isRequired,
    memoIdToDesc: PTyp.func.isRequired,
    sortieHistory: PTyp.array.isRequired,

    userPreferredMemoFocusChange: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      menuOpened: false,
    }
  }

  handleSelectMap = (k,e) => {
    e.stopPropagation()
    const userPreferredMemoFocus =
      k === 'last' ? k : String(k)
    this.props.userPreferredMemoFocusChange(userPreferredMemoFocus)
    this.setState({menuOpened: false})
  }

  handleClickGeneral = () =>
    this.props.userPreferredMemoFocusChange('general')

  handleToggleMenu = () =>
    this.setState(modifyObject('menuOpened',not))

  render() {
    const {
      style,mapInfoArr,
      getMapName,sortieHistory,
      memoFocus, memoIdToDesc,
    } = this.props
    const btnStyle = {marginTop: 0}
    const mapInfoGroups = _.toPairs(
      _.groupBy(mapInfoArr,'area')
    ).sort(
      projectorToComparator(([k,_v]) => Number(k))
    )

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
          {memoIdToDesc(memoFocus)}
        </div>
        <ButtonToolbar style={{display: 'flex', justifyContent: 'center'}}>
          <Dropdown
            open={this.state.menuOpened}
            onToggle={this.handleToggleMenu}
            id="presortie-map-panel-select-map">
            <Dropdown.Toggle
              style={btnStyle}
            >
              Maps
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <div style={{marginLeft: '2em', marginTop: '.3em'}}>
                <MenuItem
                  onSelect={this.handleSelectMap}
                  eventKey="last">
                  {
                    /*
                       having this extra layer of div prevents
                       unintended triggering of "handleToggleMenu"
                     */
                    <div style={{display: 'block', fontSize: '1.1em'}}>
                      {`Last Sortie: ${lastSortieInfo.area}-${lastSortieInfo.num}`}
                    </div>
                  }
                </MenuItem>
              </div>
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
                          onSelect={this.handleSelectMap}
                          eventKey={id}
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
                      role="menu"
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
                              onSelect={this.handleSelectMap}
                              eventKey={id}
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
          <Button
            onClick={this.handleClickGeneral}
            style={btnStyle}>
            General
          </Button>
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
    memoFocus: memoFocusSelector,
    memoIdToDesc: memoIdToDescFuncSelector,
  }),
  mapDispatchToProps,
)(MapPanelImpl)

export { MapPanel }
