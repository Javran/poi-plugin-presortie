import { join } from 'path-extra'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { modifyArray } from 'subtender'

import { PTyp } from '../ptyp'
import { loadPState } from '../p-state'
import * as MapLinks from '../map-links'
import { MapInfo } from '../structs'
import { mapDispatchToProps } from '../reducer'
import { checklistUISelector } from '../selectors'

import { SortieAreaPicker } from './sortie-area-picker'
import { ChecklistPanel } from './checklist-panel'
import { NotesPanel } from './notes-panel'
import { LinksPanel } from './links-panel'

const ChecklistPanelInst =
  connect(checklistUISelector,mapDispatchToProps)(ChecklistPanel)

class PresortieMain extends Component {
  static propTypes = {
    mapInfoArray: PTyp.array.isRequired,
    sortieHistory: PTyp.array.isRequired,
    dynMapId: PTyp.DynMapId.isRequired,
    mapId: PTyp.MapId.isRequired,
    mapExtra: PTyp.object.isRequired,

    onInit: PTyp.func.isRequired,
    onDynMapIdChange: PTyp.func.isRequired,
    onModifyMapExtras: PTyp.func.isRequired,
  }

  componentDidMount() {
    const { onInit } = this.props
    setTimeout(() => {
      onInit(loadPState())
    })
  }

  handleAddLink = linkInfo => {
    const { mapId, mapExtra, onModifyMapExtras } = this.props
    onModifyMapExtras( mapExtras => ({
      ...mapExtras,
      [mapId]: {
        ...mapExtra,
        links: [...mapExtra.links, linkInfo],
      },
    }))
  }

  handleModifyLink = linkInfo => modifier => {
    const newLinkInfo = modifier(linkInfo)
    const { mapId, mapExtra, onModifyMapExtras } = this.props
    if (! newLinkInfo) {
      // any falsy value removes the link in question
      onModifyMapExtras( mapExtras => ({
        ...mapExtras,
        [mapId]: {
          ...mapExtra,
          links: mapExtra.links.filter(x => x.name !== linkInfo.name),
        },
      }))
    } else {
      // otherwise replace old one
      onModifyMapExtras( mapExtras => {
        const ind = mapExtra.links.findIndex(x => x.name === linkInfo.name)
        return {
          ...mapExtras,
          [mapId]: {
            ...mapExtra,
            links: modifyArray(ind,() => newLinkInfo)(mapExtra.links),
          },
        }
      })
    }
  }

  handleAddNote = content => {
    const { mapId, mapExtra, onModifyMapExtras } = this.props
    onModifyMapExtras( mapExtras => {
      const newId = mapExtra.notes.length === 0 ?
        0 :
        Math.max(...mapExtra.notes.map(n => n.id))+1
      return {
        ...mapExtras,
        [mapId]: {
          ...mapExtra,
          notes: [...mapExtra.notes, {id: newId, content}],
        },
      }
    })
  }

  // TODO: be consistent regarding how handleModifyXxxx is called.
  handleModifyNote = noteId => newContent => {
    const { mapId, mapExtra, onModifyMapExtras } = this.props
    if (! newContent) {
      // falsy value, removing this note
      onModifyMapExtras( mapExtras => {
        const notes = mapExtra.notes.filter(n => n.id !== noteId)
        return {
          ...mapExtras,
          [mapId]: {
            ...mapExtra,
            notes,
          },
        }
      })
    } else {
      onModifyMapExtras( mapExtras => {
        const ind = mapExtra.notes.findIndex(n => n.id === noteId)
        return {
          ...mapExtras,
          [mapId]: {
            ...mapExtra,
            notes:
              modifyArray(ind, () => ({
                id: noteId,
                content: newContent,
              }))(mapExtra.notes),
          },
        }
      })
    }
  }

  handleModifyMapExtra = modifier => {
    const { onModifyMapExtras, mapExtra, mapId } = this.props
    onModifyMapExtras( mapExtras => ({
      ...mapExtras,
      [mapId]: modifier(mapExtra),
    }))
  }

  render() {
    const panelStyle = {
      marginBottom: 14,
    }
    const {
      mapInfoArray, sortieHistory,
      mapExtra, mapId, dynMapId,
      onDynMapIdChange,
    } = this.props
    const findMapInfo = MapInfo.findMapInfo(mapInfoArray)
    const mapInfo = findMapInfo(mapId)
    const wikiLinks = MapLinks.getLinks(mapInfo)
    const extraLinks =
      mapExtra.links.map(linkInfo => ({
        ...linkInfo,
        onModifyLink: this.handleModifyLink(linkInfo),
      }))
    const links = [...wikiLinks, ...extraLinks]
    const { notes, checklist } = mapExtra
    return (
      <div
        style={{margin: 5}}
      >
        <link rel="stylesheet" href={join(__dirname, '..', 'assets', 'presortie.css')} />
        <SortieAreaPicker
          mapInfoArray={mapInfoArray}
          sortieHistory={sortieHistory}
          dynMapId={dynMapId}
          mapId={mapId}
          onDynMapIdChange={onDynMapIdChange}
          style={{marginBottom: 14}}
        />
        <ChecklistPanelInst
          style={panelStyle}
          checklist={checklist}
          onModifyMapExtra={this.handleModifyMapExtra}
        />
        <NotesPanel
          style={panelStyle}
          notes={notes}
          onAddNote={this.handleAddNote}
          onModifyNote={this.handleModifyNote}
        />
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
