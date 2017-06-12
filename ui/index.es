import { join } from 'path-extra'
import React, { Component } from 'react'
import {
  Panel,
  ListGroup, ListGroupItem,
  Button,
} from 'react-bootstrap'

import { PTyp } from '../ptyp'
import { loadPState } from '../p-state'
import { observeAll } from '../observers'
import * as MapLinks from '../map-links'
import { MapInfo } from '../structs'

import { SortieAreaPicker } from './sortie-area-picker'

const { FontAwesome } = window

class PresortieMain extends Component {
  static propTypes = {
    mapInfoArray: PTyp.array.isRequired,
    sortieHistory: PTyp.array.isRequired,
    dynMapId: PTyp.DynMapId.isRequired,
    curMapId: PTyp.MapId.isRequired,

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
    const panelStyle = {
      marginBottom: 14,
    }
    const {
      mapInfoArray, sortieHistory,
      curMapId, dynMapId, onDynMapIdChange,
    } = this.props
    const findMapInfo = MapInfo.findMapInfo(mapInfoArray)
    const curMapInfo = findMapInfo(curMapId)
    const links = MapLinks.getLinks(curMapInfo)
    return (
      <div
        style={{margin: 5}}
      >
        <link rel="stylesheet" href={join(__dirname, '..', 'assets', 'presortie.css')} />
        <SortieAreaPicker
          mapInfoArray={mapInfoArray}
          sortieHistory={sortieHistory}
          dynMapId={dynMapId}
          curMapId={curMapId}
          onDynMapIdChange={onDynMapIdChange}
          style={{marginBottom: 14}}
        />
        <Panel
          style={{...panelStyle}}
          className="main-panel"
          header={
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={{width: 'auto', flex: 1}}>Checklist</div>
              <Button
                style={{marginTop: 0}}
                bsSize="xsmall"
                bsStyle="success">
                <FontAwesome name="check" />
              </Button>
            </div>
          }>
          TODO
        </Panel>
        <Panel
          style={{...panelStyle}}
          className="main-panel"
          header="Notes">
          TODO
        </Panel>
        <Panel
          style={{...panelStyle}}
          className="main-panel"
          header="Links">
          <ListGroup fill>
            {
              links.map( linkInfo => (
                <ListGroupItem
                  style={{padding: '8px 15px'}}
                  key={linkInfo.link}>
                  <a href={linkInfo.link}>{linkInfo.name}</a>
                </ListGroupItem>
              ))
            }
            {
              <ListGroupItem>
                TODO: custom links
              </ListGroupItem>
            }
          </ListGroup>
        </Panel>
      </div>
    )
  }
}

export {
  PresortieMain,
}
