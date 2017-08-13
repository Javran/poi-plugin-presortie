import { join } from 'path-extra'
import React, { PureComponent } from 'react'

import { MapPicker } from './map-picker'
import { ChecklistPanel } from './checklist-panel'
import { NotesPanel } from './notes-panel'
import { LinksPanel } from './links-panel'

class PresortieMain extends PureComponent {
  render() {
    const panelStyle = {
      marginBottom: 14,
    }
    return (
      <div
        style={{margin: 5}}
      >
        <link rel="stylesheet" href={join(__dirname, '..', 'assets', 'presortie.css')} />
        <MapPicker
          style={{marginBottom: 14}}
        />
        <ChecklistPanel
          style={panelStyle}
        />
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

export {
  PresortieMain,
}
