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
import { modifyArray } from '../utils'

import { SortieAreaPicker } from './sortie-area-picker'
import { ChecklistPanel } from './checklist-panel'
import { NotesPanel } from './notes-panel'
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
    const { curMapId, curMapExtra, onModifyMapExtras } = this.props
    onModifyMapExtras( mapExtras => {
      const mapExtra = curMapExtra
      return {
        ...mapExtras,
        [curMapId]: {
          ...mapExtra,
          links: [...mapExtra.links, linkInfo],
        },
      }
    })
  }

  handleModifyLink = linkInfo => modifier => {
    const newLinkInfo = modifier(linkInfo)
    const { curMapId, curMapExtra, onModifyMapExtras } = this.props
    if (! newLinkInfo) {
      // any falsy value removes the link in question
      onModifyMapExtras( mapExtras => {
        const mapExtra = curMapExtra
        return {
          ...mapExtras,
          [curMapId]: {
            ...mapExtra,
            links: mapExtra.links.filter(x => x.name !== linkInfo.name),
          },
        }
      })
    } else {
      // otherwise replace old one
      onModifyMapExtras( mapExtras => {
        const mapExtra = curMapExtra
        const ind = mapExtra.links.findIndex(x => x.name === linkInfo.name)
        return {
          ...mapExtras,
          [curMapId]: {
            ...mapExtra,
            links: modifyArray(ind,() => newLinkInfo)(mapExtra.links),
          },
        }
      })
    }
  }

  handleAddNote = content => {
    const { curMapId, curMapExtra, onModifyMapExtras } = this.props
    onModifyMapExtras( mapExtras => {
      const newId = curMapExtra.notes.length === 0 ?
        0 :
        Math.max(...curMapExtra.notes.map(n => n.id))+1
      return {
        ...mapExtras,
        [curMapId]: {
          ...curMapExtra,
          notes: [...curMapExtra.notes, {id: newId, content}],
        },
      }
    })
  }

  // TODO: be consistent regarding how handleModifyXxxx is called.
  handleModifyNote = noteId => newContent => {
    const { curMapId, curMapExtra, onModifyMapExtras } = this.props
    if (! newContent) {
      // falsy value, removing this note
      onModifyMapExtras( mapExtras => {
        const notes = curMapExtra.notes.filter(n => n.id !== noteId)
        return {
          ...mapExtras,
          [curMapId]: {
            ...curMapExtra,
            notes,
          },
        }
      })
    } else {
      onModifyMapExtras( mapExtras => {
        const ind = curMapExtra.notes.findIndex(n => n.id === noteId)
        return {
          ...mapExtras,
          [curMapId]: {
            ...curMapExtra,
            notes:
              modifyArray(ind, () => ({
                id: noteId,
                content: newContent,
              }))(curMapExtra.notes),
          },
        }
      })
    }
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
        onModifyLink: this.handleModifyLink(linkInfo),
      }))
    const links = [...wikiLinks, ...extraLinks]
    const notes = curMapExtra.notes
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
        <ChecklistPanel
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
