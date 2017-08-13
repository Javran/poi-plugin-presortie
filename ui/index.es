import { join } from 'path-extra'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { modifyArray } from 'subtender'

import { PTyp } from '../ptyp'
import * as MapLinks from '../map-links'
import { mapDispatchToProps } from '../store'
import {
  checklistUISelector,
  presortieMainUISelector,
} from '../selectors'

import { MapPicker } from './map-picker'
import { ChecklistPanel } from './checklist-panel'
import { NotesPanel } from './notes-panel'
import { LinksPanel } from './links-panel'

const ChecklistPanelInst =
  connect(checklistUISelector,mapDispatchToProps)(ChecklistPanel)

class PresortieMain extends Component {
  /* static propTypes = {
   *   mapInfoArray: PTyp.array.isRequired,
   *   sortieHistory: PTyp.array.isRequired,
   *   dynMapId: PTyp.DynMapId.isRequired,
   *   mapId: PTyp.MapId.isRequired,
   *   mapExtra: PTyp.object.isRequired,

   *   onDynMapIdChange: PTyp.func.isRequired,
   *   onModifyMapExtras: PTyp.func.isRequired,
   * }

   * handleModifyLink = linkInfo => modifier => {
   *   const newLinkInfo = modifier(linkInfo)
   *   const { mapId, mapExtra, onModifyMapExtras } = this.props
   *   if (! newLinkInfo) {
   *     // any falsy value removes the link in question
   *     onModifyMapExtras( mapExtras => ({
   *       ...mapExtras,
   *       [mapId]: {
   *         ...mapExtra,
   *         links: mapExtra.links.filter(x => x.name !== linkInfo.name),
   *       },
   *     }))
   *   } else {
   *     // otherwise replace old one
   *     onModifyMapExtras( mapExtras => {
   *       const ind = mapExtra.links.findIndex(x => x.name === linkInfo.name)
   *       return {
   *         ...mapExtras,
   *         [mapId]: {
   *           ...mapExtra,
   *           links: modifyArray(ind,() => newLinkInfo)(mapExtra.links),
   *         },
   *       }
   *     })
   *   }
   * }

   * handleModifyMapExtra = modifier => {
   *   const { onModifyMapExtras, mapExtra, mapId } = this.props
   *   onModifyMapExtras( mapExtras => ({
   *     ...mapExtras,
   *     [mapId]: modifier(mapExtra),
   *   }))
   * }
   */
  render() {
    const panelStyle = {
      marginBottom: 14,
    }
    /* const {
     *   mapInfoArray, sortieHistory,
     *   mapExtra, mapId, dynMapId,
     *   onDynMapIdChange,
     * } = this.props
     * const findMapInfo = MapInfo.findMapInfo(mapInfoArray)
     * const mapInfo = findMapInfo(mapId)
     * const wikiLinks = MapLinks.getLinks(mapInfo)
     * const extraLinks =
     *   mapExtra.links.map(linkInfo => ({
     *     ...linkInfo,
     *     onModifyLink: this.handleModifyLink(linkInfo),
     *   }))
     * const links = [...wikiLinks, ...extraLinks]
     * const { notes, checklist } = mapExtra*/
    return (
      <div
        style={{margin: 5}}
      >
        <link rel="stylesheet" href={join(__dirname, '..', 'assets', 'presortie.css')} />
        <MapPicker
          style={{marginBottom: 14}}
        />
        {/*
        <ChecklistPanelInst
          style={panelStyle}
          checklist={checklist}
          onModifyMapExtra={this.handleModifyMapExtra}
        />*/}
        <NotesPanel
          style={panelStyle}
        />
        <LinksPanel
          style={panelStyle}
        />
      </div>
    )
  }
}

/* const PresortieMain = connect(
 *   presortieMainUISelector,
 *   mapDispatchToProps
 * )(PresortieMainImpl)
 *
 */

export {
  PresortieMain,
}
