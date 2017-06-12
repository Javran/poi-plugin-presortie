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
import { MapInfo, MapExtra } from '../structs'

import { SortieAreaPicker } from './sortie-area-picker'
import { LinksPanel } from './links-panel'

const { FontAwesome } = window

class PresortieMain extends Component {
  static propTypes = {
    mapInfoArray: PTyp.array.isRequired,
    sortieHistory: PTyp.array.isRequired,
    dynMapId: PTyp.DynMapId.isRequired,
    curMapId: PTyp.MapId.isRequired,
    curMapExtra: PTyp.object.isRequired,

    onInit: PTyp.func.isRequired,
    onDynMapIdChange: PTyp.func.isRequired,
    onModifyMapExtras: PTyp.func.isRequired,
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

  handleAddLink = linkInfo => {
    const { curMapId, onModifyMapExtras } = this.props
    onModifyMapExtras( mapExtras => {
      let mapExtra = mapExtras[curMapId]
      if (typeof mapExtra === 'undefined')
        mapExtra = MapExtra.empty
      return {
        ...mapExtras,
        [curMapId]: {
          ...mapExtra,
          links: [...mapExtra.links, linkInfo],
        },
      }
    })
  }

  render() {
    const panelStyle = {
      marginBottom: 14,
    }
    const {
      mapInfoArray, sortieHistory,
      curMapExtra, curMapId, dynMapId,
      onDynMapIdChange,
    } = this.props
    const findMapInfo = MapInfo.findMapInfo(mapInfoArray)
    const curMapInfo = findMapInfo(curMapId)
    const wikiLinks = MapLinks.getLinks(curMapInfo)
    const extraLinks =
      curMapExtra.links.map(linkInfo => ({
        ...linkInfo,
        onModifyLink: () => "dummy",
      }))
    const links = [...wikiLinks, ...extraLinks]
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
        <LinksPanel
          style={panelStyle}
          links={links}
          onAddLink={this.handleAddLink}
        />
      </div>
    )
  }
}

export {
  PresortieMain,
}
