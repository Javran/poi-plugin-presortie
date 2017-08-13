import { join } from 'path-extra'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { mapDispatchToProps } from '../store'
import {
  checklistUISelector,
  presortieMainUISelector,
} from '../selectors'

import { MapPicker } from './map-picker'
import { ChecklistPanel } from './checklist-panel'
import { NotesPanel } from './notes-panel'
import { LinksPanel } from './links-panel'

class PresortieMain extends Component {
  /* static propTypes = {
   *   mapInfoArray: PTyp.array.isRequired,
   *   sortieHistory: PTyp.array.isRequired,
   *   dynMapId: PTyp.DynMapId.isRequired,
   *   mapId: PTyp.MapId.isRequired,
   *   mapExtra: PTyp.object.isRequired,

   *   onDynMapIdChange: PTyp.func.isRequired,
   * }
   */
  render() {
    const panelStyle = {
      marginBottom: 14,
    }
    /* const {
     *   mapInfoArray, sortieHistory,
     *   mapExtra, mapId, dynMapId,
     * } = this.props
     * const { checklist } = mapExtra*/
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

/* const PresortieMain = connect(
 *   presortieMainUISelector,
 *   mapDispatchToProps
 * )(PresortieMainImpl)
 *
 */

export {
  PresortieMain,
}
